from userauths.models import Profile, User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# Define a custom serializer that inherits from TokenObtainPairSerializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    '''
    class MyTokenObtainPairSerializer(TokenObtainPairSerializer):: This line creates a new token serializer called MyTokenObtainPairSerializer that is based on an existing one called TokenObtainPairSerializer. Think of it as customizing the way tokens work.
    @classmethod: This line indicates that the following function is a class method, which means it belongs to the class itself and not to an instance (object) of the class.
    def get_token(cls, user):: This is a function (or method) that gets called when we want to create a token for a user. The user is the person who's trying to access something on the website.
    token = super().get_token(user): Here, it's asking for a regular token from the original token serializer (the one it's based on). This regular token is like a key to enter the website.
    token['full_name'] = user.full_name, token['email'] = user.email, token['username'] = user.username: This code is customizing the token by adding extra information to it. For example, it's putting the user's full name, email, and username into the token. These are like special notes attached to the key.
    return token: Finally, the customized token is given back to the user. Now, when this token is used, it not only lets the user in but also carries their full name, email, and username as extra information, which the website can use as needed.
    '''
    @classmethod
    # Define a custom method to get the token for a user
    def get_token(cls, user):
        # Call the parent class's get_token method
        token = super().get_token(user)

        # Add custom claims to the token
        token['full_name'] = user.full_name
        token['email'] = user.email
        token['username'] = user.username
        try:
            token['vendor_id'] = user.vendor.id
        except:
            token['vendor_id'] = 0

        # ...

        # Return the token with custom claims
        return token

# Define a serializer for user registration, which inherits from serializers.ModelSerializer
class RegisterSerializer(serializers.ModelSerializer):
    # Define fields for the serializer, including password and password2
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        # Specify the model that this serializer is associated with
        model = User
        # Define the fields from the model that should be included in the serializer
        fields = ('full_name', 'email', 'phone', 'password', 'password2')

    def validate(self, attrs):
        # Define a validation method to check if the passwords match
        if attrs['password'] != attrs['password2']:
            # Raise a validation error if the passwords don't match
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        # Return the validated attributes
        return attrs

    def create(self, validated_data):
        # Define a method to create a new user based on validated data
        user = User.objects.create(
            full_name=validated_data['full_name'],
            email=validated_data['email'],
            phone=validated_data['phone']
        )
        email_username, mobile = user.email.split('@')
        user.username = email_username

        # Set the user's password based on the validated data
        user.set_password(validated_data['password'])
        user.save()

        # Return the created user
        return user
    

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    orders = serializers.SerializerMethodField()
    # Image field: writable for create/update, uses get_image method for reading
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Profile
        fields = '__all__'

    def get_orders(self, obj):
        from store.models import CartOrder
        orders = CartOrder.objects.filter(buyer=obj.user, payment_status="paid")
        return orders.count()

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            # Check if image is a URL string (from Google OAuth) or a file
            if isinstance(obj.image, str) and (obj.image.startswith('http://') or obj.image.startswith('https://')):
                # It's an external URL, return it as-is
                return obj.image
            
            # It's a file field
            if hasattr(obj.image, 'name') and obj.image.name:
                # Skip default placeholder images
                default_names = ['default/default-user.jpg', 'default-user.jpg']
                if obj.image.name in default_names:
                    return None
                
                try:
                    from django.conf import settings
                    from backend.storages import MediaStorage, StaticStorage
                    
                    # Get the image name/path from the database
                    image_name = obj.image.name
                    
                    # Check both static and media locations
                    # Existing files are in static/, new files go to media/
                    static_storage = StaticStorage()
                    media_storage = MediaStorage()
                    image_url = None
                    
                    # Check static location first (where existing files are)
                    if static_storage.exists(image_name):
                        image_url = static_storage.url(image_name)
                    # Check media location (where new files are saved)
                    elif media_storage.exists(image_name):
                        image_url = media_storage.url(image_name)
                    else:
                        # File doesn't exist in either location, return None
                        # Don't use obj.image.url as fallback - it might generate a URL for non-existent files
                        import logging
                        logger = logging.getLogger(__name__)
                        logger.warning(f"Profile image file does not exist in S3: {image_name} for profile {obj.id}")
                        return None
                    
                    # If URL is relative, make it absolute
                    if image_url and image_url.startswith('/'):
                        if hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN') and settings.AWS_S3_CUSTOM_DOMAIN:
                            image_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}{image_url}"
                    
                    # Ensure the URL uses static/ for files that are actually in static/
                    # If the file path contains 'accounts/users', it's likely in static/
                    if image_url and 'accounts/users' in image_name:
                        # Replace media/ with static/ if the URL has media/ prefix
                        if '/media/' in image_url:
                            image_url = image_url.replace('/media/', '/static/')
                    
                    if image_url:
                        if request:
                            return request.build_absolute_uri(image_url) if not image_url.startswith('http') else image_url
                        return image_url
                    
                    return None
                except (ValueError, AttributeError, Exception) as e:
                    # Log the error for debugging
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.error(f"Error getting image URL for profile {obj.id}: {e}")
                    return None
        return None

    def to_representation(self, instance):
        """Override to use get_image method for reading"""
        response = super().to_representation(instance)
        # Replace the image field with the result from get_image method
        response['image'] = self.get_image(instance)
        response['user'] = UserSerializer(instance.user).data
        return response
    

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()