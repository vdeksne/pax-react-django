"""DRF file fields that emit absolute URLs (and optional remote fallback for local demo)."""
import hashlib

from django.conf import settings
from rest_framework import serializers


class AbsoluteMediaField(serializers.FileField):
    """
    Avoids broken images when the SPA runs on another origin (e.g. Vite :5173) while
    the API only returns relative media paths. In DEMO_MODE, if the file is not on disk,
    uses DEMO_MEDIA_FALLBACK: 'picsum' (default, always works) or 's3' under DEMO_REMOTE_MEDIA_BASE.
    """

    def to_representation(self, value):
        if not value:
            return None
        name = getattr(value, "name", None) or ""
        if not name:
            return None
        if name.startswith("http://") or name.startswith("https://"):
            return name
        request = self.context.get("request")
        storage = value.storage
        try:
            if storage.exists(name):
                url = storage.url(name)
                if url.startswith(("http://", "https://")):
                    return url
                if request:
                    return request.build_absolute_uri(url)
                return url
        except Exception:
            pass
        if getattr(settings, "DEMO_MODE", False):
            mode = getattr(settings, "DEMO_MEDIA_FALLBACK", "picsum") or "picsum"
            if mode == "s3":
                base = getattr(settings, "DEMO_REMOTE_MEDIA_BASE", "") or ""
                if base:
                    return f"{base.rstrip('/')}/{name}"
            if mode == "picsum":
                seed = hashlib.sha256(name.encode()).hexdigest()[:32]
                return f"https://picsum.photos/seed/{seed}/600/600"
        try:
            url = value.url
            if url.startswith(("http://", "https://")):
                return url
            if request:
                return request.build_absolute_uri(url)
            return url
        except Exception:
            return None
