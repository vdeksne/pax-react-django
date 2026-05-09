"""
Pull original upload files from S3 into MEDIA_ROOT so local demo matches production assets.

Requires AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_STORAGE_BUCKET_NAME in the environment
(same as production). Paths are taken from demo/shop_demo_fixture.json.
"""
import hashlib
import json
import os
import shutil
from pathlib import Path
from urllib.parse import quote

import boto3
import requests
from botocore.exceptions import ClientError
from django.conf import settings
from django.core.management.base import BaseCommand
from dotenv import load_dotenv


def _walk_image_paths(obj, acc: set) -> None:
    if isinstance(obj, dict):
        for key, val in obj.items():
            if key == "image" and isinstance(val, str) and val.strip():
                v = val.strip()
                if not v.startswith(("http://", "https://")):
                    acc.add(v.replace("\\", "/"))
            else:
                _walk_image_paths(val, acc)
    elif isinstance(obj, list):
        for item in obj:
            _walk_image_paths(item, acc)


def _safe_relative_path(key: str) -> Path | None:
    key = key.replace("\\", "/").lstrip("/")
    parts = Path(key).parts
    if ".." in parts:
        return None
    return Path(key)


def _image_pool(media_root: Path, min_bytes: int = 64) -> list[Path]:
    allowed = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    out: list[Path] = []
    if not media_root.is_dir():
        return out
    for p in media_root.rglob("*"):
        if not p.is_file():
            continue
        if p.suffix.lower() not in allowed:
            continue
        try:
            if p.stat().st_size >= min_bytes:
                out.append(p)
        except OSError:
            continue
    return sorted(out)


def _pick_stand_in(pool: list[Path], dest: Path) -> Path | None:
    if not pool:
        return None
    ext = dest.suffix.lower()
    same_ext = [x for x in pool if x.suffix.lower() == ext]
    use = same_ext if same_ext else pool
    h = int(hashlib.sha256(str(dest).encode()).hexdigest(), 16)
    return use[h % len(use)]


class Command(BaseCommand):
    help = (
        "Download media files referenced in the demo fixture from S3 into MEDIA_ROOT. "
        "Use --recover-missing to fill gaps by copying from images already in MEDIA_ROOT."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--fixture",
            default=str(Path(settings.BASE_DIR) / "demo" / "shop_demo_fixture.json"),
            help="Path to the JSON fixture listing file paths.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="List paths only; do not write files.",
        )
        parser.add_argument(
            "--from-dir",
            default="",
            help=(
                "Copy files from this folder (layout matches MEDIA_ROOT, e.g. a backup of "
                "backend/media or an `aws s3 sync` checkout)."
            ),
        )
        parser.add_argument(
            "--s3-prefix",
            default="",
            help="Prefix for S3 object keys if uploads are stored under a folder in the bucket (e.g. 'media/').",
        )
        parser.add_argument(
            "--recover-missing",
            action="store_true",
            help=(
                "After S3/HTTP fail, copy a stand-in file from existing images under MEDIA_ROOT "
                "(not true originals; stable choice per path). Needs at least one real image locally first."
            ),
        )

    def handle(self, *args, **options):
        load_dotenv(Path(settings.BASE_DIR) / ".env")

        fixture_path = Path(options["fixture"])
        if not fixture_path.is_file():
            self.stderr.write(self.style.ERROR(f"Fixture not found: {fixture_path}"))
            return

        data = json.loads(fixture_path.read_text())
        paths = set()
        _walk_image_paths(data, paths)

        media_root = Path(settings.MEDIA_ROOT)
        bucket = (
            os.environ.get("AWS_STORAGE_BUCKET_NAME")
            or getattr(settings, "AWS_STORAGE_BUCKET_NAME", None)
            or ""
        ).strip()
        key_id = (
            os.environ.get("AWS_ACCESS_KEY_ID")
            or getattr(settings, "AWS_ACCESS_KEY_ID", None)
            or ""
        ).strip()
        secret = (
            os.environ.get("AWS_SECRET_ACCESS_KEY")
            or getattr(settings, "AWS_SECRET_ACCESS_KEY", None)
            or ""
        ).strip()
        region = (
            os.environ.get("AWS_S3_REGION_NAME")
            or os.environ.get("AWS_DEFAULT_REGION")
            or "us-east-1"
        ).strip()

        base_url = (
            getattr(settings, "DEMO_REMOTE_MEDIA_BASE", None)
            or os.environ.get("DEMO_REMOTE_MEDIA_BASE")
            or ""
        ).strip()
        if not base_url and bucket:
            base_url = f"https://{bucket}.s3.amazonaws.com"

        from_dir = (options.get("from_dir") or "").strip()
        from_root = Path(from_dir).resolve() if from_dir else None
        if from_dir and (not from_root or not from_root.is_dir()):
            self.stderr.write(
                self.style.WARNING(
                    f"--from-dir is not a directory (ignoring): {from_dir!r}"
                )
            )
            from_root = None
        s3_prefix = (options.get("s3_prefix") or "").strip().replace("\\", "/")
        if s3_prefix and not s3_prefix.endswith("/"):
            s3_prefix += "/"

        s3 = None
        if bucket and key_id and secret:
            s3 = boto3.client(
                "s3",
                aws_access_key_id=key_id,
                aws_secret_access_key=secret,
                region_name=region,
            )

        ok, fail = 0, 0
        for raw in sorted(paths):
            rel = _safe_relative_path(raw)
            if rel is None:
                self.stderr.write(self.style.WARNING(f"Skip unsafe path: {raw!r}"))
                fail += 1
                continue

            dest = media_root / rel
            if dest.is_file() and dest.stat().st_size > 0:
                self.stdout.write(f"Exists skip: {rel}")
                ok += 1
                continue

            if options["dry_run"]:
                self.stdout.write(f"Would fetch: {rel}")
                continue

            dest.parent.mkdir(parents=True, exist_ok=True)
            key = str(rel).replace("\\", "/")

            downloaded = False

            if from_root and from_root.is_dir():
                src = from_root / rel
                if src.is_file() and src.stat().st_size > 0:
                    shutil.copy2(src, dest)
                    self.stdout.write(self.style.SUCCESS(f"Copy OK: {rel}"))
                    downloaded = True
                    ok += 1

            if not downloaded and s3:
                keys_to_try = []
                if s3_prefix:
                    keys_to_try.append(f"{s3_prefix}{key}")
                keys_to_try.append(f"media/{key}")
                keys_to_try.append(key)
                seen = set()
                for s3_key in keys_to_try:
                    if s3_key in seen:
                        continue
                    seen.add(s3_key)
                    try:
                        s3.download_file(bucket, s3_key, str(dest))
                        self.stdout.write(self.style.SUCCESS(f"S3 OK: {s3_key}"))
                        downloaded = True
                        ok += 1
                        break
                    except ClientError as e:
                        code = e.response.get("Error", {}).get("Code", "")
                        if code not in ("404", "NoSuchKey", "403"):
                            self.stderr.write(
                                self.style.WARNING(f"S3 {code} {s3_key}: {e}")
                            )

            if not downloaded and base_url:
                urls = [
                    f"{base_url.rstrip('/')}/{quote(key, safe='/')}",
                ]
                if not key.startswith("media/"):
                    urls.append(
                        f"{base_url.rstrip('/')}/{quote('media/' + key, safe='/')}"
                    )
                got = False
                for url in urls:
                    try:
                        r = requests.get(url, timeout=60)
                        if r.status_code == 200 and r.content:
                            dest.write_bytes(r.content)
                            self.stdout.write(self.style.SUCCESS(f"HTTP OK: {key}"))
                            downloaded = True
                            ok += 1
                            got = True
                            break
                        self.stderr.write(
                            self.style.WARNING(f"HTTP {r.status_code}: {url}")
                        )
                    except requests.RequestException as e:
                        self.stderr.write(self.style.WARNING(f"HTTP fail {key}: {e}"))
                    if got:
                        break

            if not downloaded and options.get("recover_missing"):
                pool = _image_pool(media_root)
                stand = _pick_stand_in(pool, dest)
                if stand:
                    try:
                        if stand.resolve() != dest.resolve():
                            shutil.copy2(stand, dest)
                            try:
                                rel_stand = stand.relative_to(media_root)
                            except ValueError:
                                rel_stand = stand
                            self.stdout.write(
                                self.style.WARNING(
                                    f"Recovered stand-in from {rel_stand} -> {key}"
                                )
                            )
                            downloaded = True
                            ok += 1
                    except OSError as e:
                        self.stderr.write(
                            self.style.WARNING(f"Recover copy failed {key}: {e}")
                        )

            if not downloaded:
                self.stderr.write(
                    self.style.ERROR(
                        f"Missing: {key} (set AWS_* in .env or fix DEMO_REMOTE_MEDIA_BASE)"
                    )
                )
                fail += 1

        self.stdout.write(self.style.NOTICE(f"Done. saved={ok} failed={fail}"))
