from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from store.models import CancelledOrder, Cart, CartOrderItem, Notification, CouponUsers, Product, Tag ,Category, DeliveryCouriers, CartOrder, Gallery, Brand, ProductFaq, Review,  Specification, Coupon, Color, Size, Address, Wishlist, Vendor
from addon.models import ConfigSettings
from store.models import Gallery
from userauths.serializer import ProfileSerializer, UserSerializer

class ConfigSettingsSerializer(serializers.ModelSerializer):

    class Meta:
            model = ConfigSettings
            fields = '__all__'


# Define a serializer for the Category model
class CategorySerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = '__all__'
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'name') and obj.image.name:
            # Skip default placeholder images that were never actually uploaded
            default_names = ['category.jpg', 'product.jpg', 'brand.jpg', 'gallery.jpg', 'shop-image.jpg']
            if obj.image.name in default_names:
                return None
            
            try:
                # Get the URL from the storage backend
                image_url = obj.image.url
                if image_url:
                    from django.conf import settings
                    
                    # Backward compatibility: If URL points to /media/ but file might be in /static/
                    # Many existing files were uploaded to static/ before the storage change
                    if '/media/' in image_url and hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN'):
                        # For backward compatibility, use static path for existing files
                        static_url = image_url.replace('/media/', '/static/')
                        image_url = static_url
                    
                    # If URL is relative, make it absolute
                    if image_url.startswith('/'):
                        if hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN') and settings.AWS_S3_CUSTOM_DOMAIN:
                            image_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}{image_url}"
                    
                    if request:
                        return request.build_absolute_uri(image_url) if not image_url.startswith('http') else image_url
                    return image_url
            except (ValueError, AttributeError, Exception) as e:
                # Log the error for debugging
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Error getting image URL for category {obj.id}: {e}")
                pass
        return None
    
    def get_products(self, obj):
        # Optimize: Only get products if needed (for detail views)
        # For list views, this method might not be called, but if it is, optimize the query
        products = Product.objects.filter(category=obj).only('id', 'title', 'slug', 'price', 'image')
        return ProductListSerializer(products, many=True, context=self.context).data

# Define a serializer for the Tag model
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

# Define a serializer for the Brand model
class BrandSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Brand
        fields = '__all__'
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'name') and obj.image.name:
            # Skip default placeholder images that were never actually uploaded
            default_names = ['brand.jpg', 'category.jpg', 'product.jpg', 'gallery.jpg', 'shop-image.jpg']
            if obj.image.name in default_names:
                return None
            
            try:
                # Get the URL from the storage backend
                image_url = obj.image.url
                if image_url:
                    from django.conf import settings
                    
                    # Backward compatibility: If URL points to /media/ but file might be in /static/
                    # Many existing files were uploaded to static/ before the storage change
                    if '/media/' in image_url and hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN'):
                        # For backward compatibility, use static path for existing files
                        static_url = image_url.replace('/media/', '/static/')
                        image_url = static_url
                    
                    # If URL is relative, make it absolute
                    if image_url.startswith('/'):
                        if hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN') and settings.AWS_S3_CUSTOM_DOMAIN:
                            image_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}{image_url}"
                    
                    if request:
                        return request.build_absolute_uri(image_url) if not image_url.startswith('http') else image_url
                    return image_url
            except (ValueError, AttributeError, Exception) as e:
                # Log the error for debugging
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Error getting image URL for brand {obj.id}: {e}")
                pass
        return None


        # Define a serializer for the Gallery model
class GallerySerializer(serializers.ModelSerializer):
    # Serialize the related Product model
    image = serializers.SerializerMethodField()

    class Meta:
        model = Gallery
        fields = '__all__'
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'name') and obj.image.name:
            # Skip default placeholder images that were never actually uploaded
            default_names = ['gallery.jpg', 'category.jpg', 'product.jpg', 'brand.jpg', 'shop-image.jpg']
            if obj.image.name in default_names:
                return None
            
            try:
                # Get the URL from the storage backend
                image_url = obj.image.url
                if image_url:
                    from django.conf import settings
                    
                    # Backward compatibility: If URL points to /media/ but file might be in /static/
                    # Many existing files were uploaded to static/ before the storage change
                    if '/media/' in image_url and hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN'):
                        # For backward compatibility, use static path for existing files
                        static_url = image_url.replace('/media/', '/static/')
                        image_url = static_url
                    
                    # If URL is relative, make it absolute
                    if image_url.startswith('/'):
                        if hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN') and settings.AWS_S3_CUSTOM_DOMAIN:
                            image_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}{image_url}"
                    
                    if request:
                        return request.build_absolute_uri(image_url) if not image_url.startswith('http') else image_url
                    return image_url
            except (ValueError, AttributeError, Exception) as e:
                # Log the error for debugging
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Error getting image URL for gallery {obj.id}: {e}")
                pass
        return None

# Define a serializer for the Specification model
class SpecificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Specification
        fields = '__all__'

# Define a serializer for the Size model
class SizeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Size
        fields = '__all__'

# Define a serializer for the Color model
class ColorSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Color
        fields = '__all__'
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'name') and obj.image.name:
            # Skip default placeholder images that were never actually uploaded
            default_names = ['gallery.jpg', 'category.jpg', 'product.jpg', 'brand.jpg', 'shop-image.jpg']
            if obj.image.name in default_names:
                return None
            
            try:
                # Get the URL from the storage backend
                image_url = obj.image.url
                if image_url:
                    from django.conf import settings
                    
                    # Backward compatibility: If URL points to /media/ but file might be in /static/
                    # Many existing files were uploaded to static/ before the storage change
                    if '/media/' in image_url and hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN'):
                        # For backward compatibility, use static path for existing files
                        static_url = image_url.replace('/media/', '/static/')
                        image_url = static_url
                    
                    # If URL is relative, make it absolute
                    if image_url.startswith('/'):
                        if hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN') and settings.AWS_S3_CUSTOM_DOMAIN:
                            image_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}{image_url}"
                    
                    if request:
                        return request.build_absolute_uri(image_url) if not image_url.startswith('http') else image_url
                    return image_url
            except (ValueError, AttributeError, Exception) as e:
                # Log the error for debugging
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Error getting image URL for color {obj.id}: {e}")
                pass
        return None


# Lightweight serializer for list views (without nested data)
class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product lists - excludes nested relations for better performance"""
    product_rating = serializers.SerializerMethodField()
    rating_count = serializers.SerializerMethodField()
    order_count = serializers.SerializerMethodField()
    get_precentage = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            "id", "title", "image", "description", "price", "old_price",
            "shipping_amount", "stock_qty", "in_stock", "status", "type",
            "featured", "hot_deal", "special_offer", "digital", "views",
            "orders", "saved", "sku", "pid", "slug", "date", "tags",
            "category", "brand", "vendor", "product_rating", "rating_count",
            "order_count", "get_precentage"
        ]
        depth = 1  # Only one level deep for foreign keys
    
    def get_image(self, obj):
        """Image URL generation using Django's FileField.url method with backward compatibility"""
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'name') and obj.image.name:
            # Skip default placeholder images that were never actually uploaded
            default_names = ['product.jpg', 'category.jpg', 'brand.jpg', 'gallery.jpg', 'shop-image.jpg']
            if obj.image.name in default_names:
                return None
            
            try:
                from django.conf import settings
                from backend.storages import MediaStorage, StaticStorage
                
                # Get the base image name (without media/ or static/ prefix)
                image_name = obj.image.name
                if image_name.startswith('media/'):
                    image_name = image_name[6:]
                elif image_name.startswith('static/'):
                    image_name = image_name[7:]
                
                # Try media first (new files), then static (old files for backward compatibility)
                # Use Django's FileField.url which automatically uses the correct storage backend
                image_url = obj.image.url
                
                # Also generate static URL for backward compatibility
                # Many existing files were uploaded to static/ before the storage change
                if image_url and hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN') and settings.AWS_S3_CUSTOM_DOMAIN:
                    # Generate both URLs - frontend will try media first, then static if 404
                    # For now, prefer static for backward compatibility with existing files
                    if '/media/' in image_url:
                        static_storage = StaticStorage()
                        static_url = static_storage.url(image_name)
                        # If static URL is different, we could return both, but for simplicity
                        # let's try static first for existing files (they're more likely to be there)
                        # Check if image name suggests it's an older file (has user_ prefix or similar patterns)
                        if 'user_' in image_name or image_name.startswith('product_'):
                            # Likely an older file, try static first
                            image_url = static_url
                
                # Make absolute if needed
                if image_url and image_url.startswith('/'):
                    if hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN') and settings.AWS_S3_CUSTOM_DOMAIN:
                        image_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}{image_url}"
                
                if image_url:
                    if request and not image_url.startswith('http'):
                        return request.build_absolute_uri(image_url)
                    return image_url
            except (ValueError, AttributeError, Exception) as e:
                # Only log errors in development/debug mode
                import logging
                logger = logging.getLogger(__name__)
                if hasattr(settings, 'DEBUG') and settings.DEBUG:
                    logger.error(f"Error getting image URL for product {obj.id}: {e}")
                return None
        return None
    
    def get_product_rating(self, obj):
        """Get product rating - use annotation if available, otherwise call method"""
        # If queryset was annotated, use that (faster)
        if hasattr(obj, 'avg_rating'):
            return float(obj.avg_rating) if obj.avg_rating else 0
        # Otherwise call the method (slower but works)
        return obj.product_rating() if hasattr(obj, 'product_rating') else 0
    
    def get_rating_count(self, obj):
        """Get rating count - use annotation if available"""
        if hasattr(obj, 'rating_count_annotated'):
            return obj.rating_count_annotated
        return obj.rating_count() if hasattr(obj, 'rating_count') else 0
    
    def get_order_count(self, obj):
        """Get order count - use annotation if available"""
        if hasattr(obj, 'order_count_annotated'):
            return obj.order_count_annotated
        return obj.order_count() if hasattr(obj, 'order_count') else 0
    
    def get_get_precentage(self, obj):
        """Get discount percentage"""
        return obj.get_precentage() if hasattr(obj, 'get_precentage') else 0

# Full serializer for detail views (with nested data)
class ProductSerializer(serializers.ModelSerializer):
    # Serialize related Category, Tag, and Brand models
    # category = CategorySerializer(many=True, read_only=True)
    # tags = TagSerializer(many=True, read_only=True)
    gallery = GallerySerializer(many=True, read_only=True)
    color = ColorSerializer(many=True, read_only=True)
    size = SizeSerializer(many=True, read_only=True)
    specification = SpecificationSerializer(many=True, read_only=True)
    # Image field: writable for create/update, uses get_image method for reading
    image = serializers.ImageField(required=False, allow_null=True)
    # rating = serializers.IntegerField(required=False)
    
    # specification = SpecificationSerializer(many=True, required=False)
    # color = ColorSerializer(many=True, required=False)
    # size = SizeSerializer(many=True, required=False)
    # gallery = GallerySerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "image",
            "description",
            "category",
            "tags",
            "brand",
            "price",
            "old_price",
            "shipping_amount",
            "stock_qty",
            "in_stock",
            "status",
            "type",
            "featured",
            "hot_deal",
            "special_offer",
            "digital",
            "views",
            "orders",
            "saved",
            # "rating",
            "vendor",
            "sku",
            "pid",
            "slug",
            "date",
            "gallery",
            "specification",
            "size",
            "color",
            "product_rating",
            "rating_count",
            'order_count',
            "get_precentage",
        ]
    
    def get_image(self, obj):
        """Image URL generation using Django's FileField.url method with backward compatibility"""
        request = self.context.get('request')
        # Check if image exists and is a valid file (not just a default string)
        if obj.image and hasattr(obj.image, 'name') and obj.image.name:
            # Skip default placeholder images that were never actually uploaded
            default_names = ['product.jpg', 'category.jpg', 'brand.jpg', 'gallery.jpg', 'shop-image.jpg']
            if obj.image.name in default_names:
                return None
            
            try:
                from django.conf import settings
                from backend.storages import MediaStorage, StaticStorage
                
                # Get the base image name (without media/ or static/ prefix)
                image_name = obj.image.name
                if image_name.startswith('media/'):
                    image_name = image_name[6:]
                elif image_name.startswith('static/'):
                    image_name = image_name[7:]
                
                # Use Django's FileField.url which automatically uses the correct storage backend
                image_url = obj.image.url
                
                # Also generate static URL for backward compatibility
                # Many existing files were uploaded to static/ before the storage change
                if image_url and hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN') and settings.AWS_S3_CUSTOM_DOMAIN:
                    # Generate both URLs - frontend will try media first, then static if 404
                    # For now, prefer static for backward compatibility with existing files
                    if '/media/' in image_url:
                        static_storage = StaticStorage()
                        static_url = static_storage.url(image_name)
                        # Check if image name suggests it's an older file (has user_ prefix or similar patterns)
                        if 'user_' in image_name or image_name.startswith('product_'):
                            # Likely an older file, try static first
                            image_url = static_url
                
                # Make absolute if needed
                if image_url and image_url.startswith('/'):
                    if hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN') and settings.AWS_S3_CUSTOM_DOMAIN:
                        image_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}{image_url}"
                
                if image_url:
                    if request and not image_url.startswith('http'):
                        return request.build_absolute_uri(image_url)
                    return image_url
                
                return None
            except (ValueError, AttributeError, Exception) as e:
                # Only log errors in development/debug mode
                import logging
                logger = logging.getLogger(__name__)
                if hasattr(settings, 'DEBUG') and settings.DEBUG:
                    logger.error(f"Error getting image URL for product {obj.id}: {e}")
                return None
        return None
    
    def to_representation(self, instance):
        """Override to use get_image method for reading"""
        representation = super().to_representation(instance)
        # Replace the image field with the result from get_image method
        representation['image'] = self.get_image(instance)
        return representation
    
    def __init__(self, *args, **kwargs):
        super(ProductSerializer, self).__init__(*args, **kwargs)
        # Context is automatically passed to nested serializers by DRF
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new product, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3




# Define a serializer for the ProductFaq model
class ProductFaqSerializer(serializers.ModelSerializer):
    # Serialize the related Product model
    product = ProductSerializer()

    class Meta:
        model = ProductFaq
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(ProductFaqSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new product FAQ, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3

# Define a serializer for the CartOrderItem model
class CartSerializer(serializers.ModelSerializer):
    # Serialize the related Product model
    product = ProductSerializer()  

    class Meta:
        model = Cart
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super(CartSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new cart order item, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3

# Define a serializer for the CartOrderItem model
class CartOrderItemSerializer(serializers.ModelSerializer):
    # Serialize the related Product model
    # product = ProductSerializer()  

    class Meta:
        model = CartOrderItem
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super(CartOrderItemSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new cart order item, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3

# Define a serializer for the CartOrder model
class CartOrderSerializer(serializers.ModelSerializer):
    # Serialize related CartOrderItem models
    orderitem = CartOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = CartOrder
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(CartOrderSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new cart order, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3


class VendorSerializer(serializers.ModelSerializer):
    # Serialize related CartOrderItem models
    user = UserSerializer(read_only=True)
    # Image field: writable for create/update, uses get_image method for reading
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Vendor
        fields = '__all__'
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'name') and obj.image.name:
            # Skip default placeholder images
            default_names = ['shop-image.jpg', 'default/shop-image.jpg']
            if obj.image.name in default_names:
                return None
            
            try:
                from django.conf import settings
                from backend.storages import MediaStorage, StaticStorage
                
                image_name = obj.image.name
                
                # Check both static and media locations
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
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.warning(f"Vendor image file does not exist in S3: {image_name} for vendor {obj.id}")
                    return None
                
                # If URL is relative, make it absolute
                if image_url and image_url.startswith('/'):
                    if hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN') and settings.AWS_S3_CUSTOM_DOMAIN:
                        image_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}{image_url}"
                
                if image_url:
                    if request:
                        return request.build_absolute_uri(image_url) if not image_url.startswith('http') else image_url
                    return image_url
                
                return None
            except (ValueError, AttributeError, Exception) as e:
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Error getting image URL for vendor {obj.id}: {e}")
                return None
        return None
    
    def to_representation(self, instance):
        """Override to use get_image method for reading"""
        representation = super().to_representation(instance)
        representation['image'] = self.get_image(instance)
        return representation

    def __init__(self, *args, **kwargs):
        super(VendorSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new cart order, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3

# Define a serializer for the Review model
class ReviewSerializer(serializers.ModelSerializer):
    # Serialize the related Product model
    product = ProductSerializer()
    profile = ProfileSerializer()
    
    class Meta:
        model = Review
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(ReviewSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new review, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3

# Define a serializer for the Wishlist model
class WishlistSerializer(serializers.ModelSerializer):
    # Serialize the related Product model
    product = ProductSerializer()

    class Meta:
        model = Wishlist
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(WishlistSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new wishlist item, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3

# Define a serializer for the Address model
class AddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(AddressSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new address, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3

# Define a serializer for the CancelledOrder model
class CancelledOrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = CancelledOrder
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(CancelledOrderSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new cancelled order, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3

# Define a serializer for the Coupon model
class CouponSerializer(serializers.ModelSerializer):

    class Meta:
        model = Coupon
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(CouponSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new coupon, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3

# Define a serializer for the CouponUsers model
class CouponUsersSerializer(serializers.ModelSerializer):
    # Serialize the related Coupon model
    coupon =  CouponSerializer()

    class Meta:
        model = CouponUsers
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(CouponUsersSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new coupon user, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3

# Define a serializer for the DeliveryCouriers model
class DeliveryCouriersSerializer(serializers.ModelSerializer):

    class Meta:
        model = DeliveryCouriers
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(NotificationSerializer, self).__init__(*args, **kwargs)
        # Customize serialization depth based on the request method.
        request = self.context.get('request')
        if request and request.method == 'POST':
            # When creating a new coupon user, set serialization depth to 0.
            self.Meta.depth = 0
        else:
            # For other methods, set serialization depth to 3.
            self.Meta.depth = 3


class SummarySerializer(serializers.Serializer):
    products = serializers.IntegerField()
    orders = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=10, decimal_places=2)

class EarningSummarySerializer(serializers.Serializer):
    monthly_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)


class CouponSummarySerializer(serializers.Serializer):
    total_coupons = serializers.IntegerField(default=0)
    active_coupons = serializers.IntegerField(default=0)


class NotificationSummarySerializer(serializers.Serializer):
    un_read_noti = serializers.IntegerField(default=0)
    read_noti = serializers.IntegerField(default=0)
    all_noti = serializers.IntegerField(default=0)