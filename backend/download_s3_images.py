#!/usr/bin/env python
"""
Script to download images from S3 to local media directory
"""
import os
import sys
import boto3
from botocore.exceptions import ClientError
from pathlib import Path
from environs import Env

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()

from store.models import Product, Category, Vendor, Gallery

env = Env()
env.read_env()

# Get S3 credentials
AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
AWS_LOCATION = env("AWS_LOCATION", default="static")

BASE_DIR = Path(__file__).resolve().parent
MEDIA_ROOT = BASE_DIR / 'media'

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

def download_file_from_s3(bucket_name, s3_key, local_path):
    """Download a single file from S3"""
    try:
        # Ensure the directory exists
        local_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Download the file
        print(f"Downloading: {s3_key} -> {local_path}")
        s3_client.download_file(bucket_name, s3_key, str(local_path))
        print(f"✓ Successfully downloaded: {local_path}")
        return True
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code', 'Unknown')
        if error_code == 'NoSuchKey':
            print(f"✗ File not found in S3: {s3_key}")
        else:
            print(f"✗ Error downloading {s3_key}: {e}")
        return False
    except Exception as e:
        print(f"✗ Unexpected error downloading {s3_key}: {e}")
        return False

def download_images():
    """Download all images referenced in the database"""
    downloaded = 0
    failed = 0
    
    print("=" * 60)
    print("Downloading images from S3...")
    print("=" * 60)
    
    # Download product images
    print("\n--- Product Images ---")
    for product in Product.objects.exclude(image='').exclude(image__isnull=True):
        if product.image:
            s3_key = f"{AWS_LOCATION}/{product.image.name}"
            local_path = MEDIA_ROOT / product.image.name
            if download_file_from_s3(AWS_STORAGE_BUCKET_NAME, s3_key, local_path):
                downloaded += 1
            else:
                failed += 1
    
    # Download category images
    print("\n--- Category Images ---")
    for category in Category.objects.exclude(image='').exclude(image__isnull=True):
        if category.image:
            s3_key = f"{AWS_LOCATION}/{category.image.name}"
            local_path = MEDIA_ROOT / category.image.name
            if download_file_from_s3(AWS_STORAGE_BUCKET_NAME, s3_key, local_path):
                downloaded += 1
            else:
                failed += 1
    
    # Download vendor images
    print("\n--- Vendor Images ---")
    for vendor in Vendor.objects.exclude(image='').exclude(image__isnull=True):
        if vendor.image:
            s3_key = f"{AWS_LOCATION}/{vendor.image.name}"
            local_path = MEDIA_ROOT / vendor.image.name
            if download_file_from_s3(AWS_STORAGE_BUCKET_NAME, s3_key, local_path):
                downloaded += 1
            else:
                failed += 1
    
    # Download gallery images
    print("\n--- Gallery Images ---")
    for gallery in Gallery.objects.all():
        if gallery.image:
            s3_key = f"{AWS_LOCATION}/{gallery.image.name}"
            local_path = MEDIA_ROOT / gallery.image.name
            if download_file_from_s3(AWS_STORAGE_BUCKET_NAME, s3_key, local_path):
                downloaded += 1
            else:
                failed += 1
    
    print("\n" + "=" * 60)
    print(f"Download complete!")
    print(f"✓ Successfully downloaded: {downloaded}")
    print(f"✗ Failed: {failed}")
    print("=" * 60)

if __name__ == "__main__":
    # Verify credentials
    if not AWS_ACCESS_KEY_ID or AWS_ACCESS_KEY_ID == "placeholder":
        print("ERROR: AWS_ACCESS_KEY_ID not set or is placeholder")
        print("Please update your .env file with valid S3 credentials")
        sys.exit(1)
    
    if not AWS_SECRET_ACCESS_KEY or AWS_SECRET_ACCESS_KEY == "placeholder":
        print("ERROR: AWS_SECRET_ACCESS_KEY not set or is placeholder")
        print("Please update your .env file with valid S3 credentials")
        sys.exit(1)
    
    if not AWS_STORAGE_BUCKET_NAME or AWS_STORAGE_BUCKET_NAME == "placeholder":
        print("ERROR: AWS_STORAGE_BUCKET_NAME not set or is placeholder")
        print("Please update your .env file with valid S3 bucket name")
        sys.exit(1)
    
    print(f"Using S3 Bucket: {AWS_STORAGE_BUCKET_NAME}")
    print(f"Location prefix: {AWS_LOCATION}")
    print()
    
    download_images()



