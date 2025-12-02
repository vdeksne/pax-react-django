from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage


class StaticStorage(S3Boto3Storage):
    location = 'static'
    default_acl = 'public-read'
    
    def __init__(self, *args, **kwargs):
        kwargs['location'] = 'static'
        super(StaticStorage, self).__init__(*args, **kwargs)


class MediaStorage(S3Boto3Storage):
    location = 'media'
    default_acl = 'public-read'
    file_overwrite = False
    
    def __init__(self, *args, **kwargs):
        kwargs['location'] = 'media'
        super(MediaStorage, self).__init__(*args, **kwargs)
    
    def url(self, name):
        """Override url method to ensure correct S3 URL generation"""
        # If name already includes 'media/' or 'static/', remove it
        if name.startswith('media/'):
            name = name[6:]  # Remove 'media/' prefix
        elif name.startswith('static/'):
            name = name[7:]  # Remove 'static/' prefix
        
        # Build the URL with the correct location (media for new uploads)
        url = super().url(name)
        
        # For backward compatibility: existing files are in static/, new files go to media/
        # We'll handle this in the serializer to check both locations
        return url

