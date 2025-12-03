# Django Packages
from django.shortcuts import get_object_or_404, redirect, render
from django.http import JsonResponse, HttpResponseNotFound, HttpResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.db import transaction
from django.urls import reverse
from django.conf import settings
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string


# Restframework Packages
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

# Serializers
from userauths.serializer import MyTokenObtainPairSerializer, RegisterSerializer
from store.serializers import CancelledOrderSerializer, CartSerializer, CartOrderItemSerializer, CouponUsersSerializer, ProductSerializer, ProductListSerializer, TagSerializer ,CategorySerializer, DeliveryCouriersSerializer, CartOrderSerializer, GallerySerializer, BrandSerializer, ProductFaqSerializer, ReviewSerializer,  SpecificationSerializer, CouponSerializer, ColorSerializer, SizeSerializer, AddressSerializer, WishlistSerializer, ConfigSettingsSerializer

# Models
from userauths.models import User
from store.models import CancelledOrder, CartOrderItem, CouponUsers, Cart, Notification, Product, Tag ,Category, DeliveryCouriers, CartOrder, Gallery, Brand, ProductFaq, Review,  Specification, Coupon, Color, Size, Address, Wishlist
from addon.models import ConfigSettings, Tax
from vendor.models import Vendor

# Others Packages
import json
from decimal import Decimal
import stripe
import requests

stripe.api_key = settings.STRIPE_SECRET_KEY
PAYPAL_CLIENT_ID = settings.PAYPAL_CLIENT_ID
PAYPAL_SECRET_ID = settings.PAYPAL_SECRET_ID


def send_notification(user=None, vendor=None, order=None, order_item=None):
    try:
        print(f"Creating notification - user: {user}, vendor: {vendor}, order: {order}, order_item: {order_item}")
        
        # Validate that at least one of user or vendor is provided
        if not user and not vendor:
            print("Error: Neither user nor vendor provided")
            return None
            
        notification = Notification.objects.create(
            user=user,
            vendor=vendor,
            order=order,
            order_item=order_item,
            seen=False  # Explicitly set seen to False
        )
        print(f"Notification created successfully - id: {notification.id}")
        return notification
    except Exception as e:
        print(f"Error creating notification: {str(e)}")
        return None

class ConfigSettingsDetailView(generics.RetrieveAPIView):
    serializer_class = ConfigSettingsSerializer

    def get_object(self):
        # Use the get method to retrieve the first ConfigSettings object
        return ConfigSettings.objects.first()

    permission_classes = (AllowAny,)

class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = (AllowAny,)
    
    def get_queryset(self):
        # Optimize category queries - categories are usually small, but still optimize
        return Category.objects.filter(active=True).only('id', 'title', 'image', 'slug', 'active')
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        # Add cache headers - categories don't change often
        response['Cache-Control'] = 'public, max-age=600'  # Cache for 10 minutes
        return response


class BrandListView(generics.ListAPIView):
    serializer_class = BrandSerializer
    queryset = Brand.objects.filter(active=True)
    permission_classes = (AllowAny,)

class FeaturedProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer  # Use lightweight serializer
    permission_classes = (AllowAny,)
    
    def get_queryset(self):
        # Optimize featured products query
        return Product.objects.filter(status="published", featured=True).select_related(
            'category', 'vendor'
        ).order_by('-date')[:3]

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer  # Use lightweight serializer for list
    permission_classes = (AllowAny,)
    pagination_class = StandardResultsSetPagination
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        # Add cache headers to reduce server load
        response['Cache-Control'] = 'public, max-age=300'  # Cache for 5 minutes
        return response
    
    def get_queryset(self):
        from django.db.models import Avg, Count, Q
        from store.models import Review, CartOrderItem
        
        # Optimize queries with select_related for ForeignKey relationships
        # Note: brand is CharField, not ForeignKey, so no select_related needed
        # Add annotations to avoid N+1 queries for ratings and order counts
        queryset = Product.objects.filter(status="published").select_related(
            'category',  # ForeignKey
            'vendor'     # ForeignKey
        ).annotate(
            # Pre-calculate average rating to avoid N+1 queries
            avg_rating=Avg('reviews__rating'),
            # Pre-calculate rating count
            rating_count_annotated=Count('reviews', distinct=True),
            # Pre-calculate order count for paid orders
            order_count_annotated=Count(
                'order_item',
                filter=Q(order_item__order__payment_status='paid'),
                distinct=True
            )
        ).order_by('-date')  # Order by date for consistent pagination
        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer

    def get_object(self):
        # Retrieve the product using the provided slug from the URL
        slug = self.kwargs.get('slug')
        return Product.objects.get(slug=slug)
    
class CartApiView(generics.ListCreateAPIView):
    serializer_class = CartSerializer
    queryset = Cart.objects.all()
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        try:
            # Log the incoming request data
            print("Request data:", request.data)
            print("Content type:", request.content_type)

            # Handle both FormData and JSON data
            if request.content_type == 'multipart/form-data':
                payload = request.data
            else:
                payload = request.data

            # Log the payload after processing
            print("Processed payload:", payload)

            # Validate required fields
            required_fields = ['product', 'qty', 'price', 'shipping_amount', 'country', 'size', 'color', 'cart_id']
            for field in required_fields:
                if field not in payload:
                    print(f"Missing required field: {field}")
                    return Response({"error": f"Missing required field: {field}"}, status=status.HTTP_400_BAD_REQUEST)

            # Convert string values to appropriate types with validation
            try:
                product_id = int(payload['product'])
                qty = int(payload['qty'])
                price = Decimal(str(payload['price']))
                shipping_amount = Decimal(str(payload['shipping_amount']))
                print(f"Converted values - product_id: {product_id}, qty: {qty}, price: {price}, shipping_amount: {shipping_amount}")
            except (ValueError, TypeError) as e:
                print(f"Error converting values: {str(e)}")
                return Response({"error": f"Invalid numeric value: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

            # Get string values with defaults
            user_id = payload.get('user', '')
            country = payload.get('country', '')
            size = payload.get('size', 'No Size')
            color = payload.get('color', 'No Color')
            cart_id = payload.get('cart_id', '')
            
            print(f"String values - user_id: {user_id}, country: {country}, size: {size}, color: {color}, cart_id: {cart_id}")
            
            # Validate product exists and is published
            try:
                product = Product.objects.get(status="published", id=product_id)
                print(f"Product found - id: {product_id}")
            except Product.DoesNotExist:
                print(f"Product not found - id: {product_id}")
                return Response({"error": "Product not found or not available"}, status=status.HTTP_404_NOT_FOUND)

            # Handle user
            user = None
            if user_id and user_id != "":
                try:
                    user = User.objects.get(id=user_id)
                    print(f"User found - id: {user_id}")
                except User.DoesNotExist:
                    print(f"User not found - id: {user_id}")
                    return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
            # Get tax rate
            tax_rate = Decimal('0.00')
            try:
                tax = Tax.objects.filter(country=country).first()
                if tax:
                    tax_rate = Decimal(str(tax.rate)) / Decimal('100')
                    print(f"Tax found - rate: {tax_rate}")
                else:
                    print(f"No tax found for country: {country}")
            except Exception as e:
                print(f"Error getting tax rate: {str(e)}")

            # Check for existing cart item
            cart = Cart.objects.filter(cart_id=cart_id, product=product).first()
            if cart:
                print(f"Existing cart found - id: {cart.id}")
            else:
                print("No existing cart found")

            # Calculate service fee with safe defaults
            service_fee = Decimal('0.00')
            try:
                config_settings = ConfigSettings.objects.first()
                print(f"Config settings found: {bool(config_settings)}")
                
                if config_settings and hasattr(config_settings, 'service_fee_charge_type'):
                    service_fee_type = config_settings.service_fee_charge_type
                    print(f"Service fee type: {service_fee_type}")
                    
                    if service_fee_type == "percentage":
                        service_fee_percentage = getattr(config_settings, 'service_fee_percentage', 0)
                        service_fee = (Decimal(str(service_fee_percentage)) / Decimal('100')) * (price * qty)
                        print(f"Percentage service fee calculated: {service_fee}")
                    else:
                        service_fee = getattr(config_settings, 'service_fee_flat_rate', Decimal('0.00'))
                        print(f"Flat rate service fee: {service_fee}")
                else:
                    print("No config settings found or missing service_fee_charge_type, using default service fee of 0")
            except Exception as e:
                print(f"Error calculating service fee: {str(e)}")
                # Continue with default service fee of 0

            # Calculate totals
            sub_total = price * qty
            shipping_total = shipping_amount * qty
            tax_fee = qty * tax_rate
            total = sub_total + shipping_total + service_fee + tax_fee

            print("Final calculations:", {
                "sub_total": sub_total,
                "shipping_total": shipping_total,
                "tax_fee": tax_fee,
                "service_fee": service_fee,
                "total": total
            })

            # Update or create cart item
            if cart:
                cart.product = product
                cart.user = user
                cart.qty = qty
                cart.price = price
                cart.sub_total = sub_total
                cart.shipping_amount = shipping_total
                cart.size = size
                cart.tax_fee = tax_fee
                cart.color = color
                cart.country = country
                cart.cart_id = cart_id
                cart.service_fee = service_fee
                cart.total = total
                cart.save()
                print("Cart updated successfully")

                return Response({"message": "Cart updated successfully"}, status=status.HTTP_200_OK)
            else:
                cart = Cart()
                cart.product = product
                cart.user = user
                cart.qty = qty
                cart.price = price
                cart.sub_total = sub_total
                cart.shipping_amount = shipping_total
                cart.size = size
                cart.tax_fee = tax_fee
                cart.color = color
                cart.country = country
                cart.cart_id = cart_id
                cart.service_fee = service_fee
                cart.total = total
                cart.save()
                print("New cart created successfully")

                return Response({"message": "Cart Created Successfully"}, status=status.HTTP_201_CREATED)
        except KeyError as e:
            print(f"KeyError: {str(e)}")
            return Response({"error": f"Missing required field: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError as e:
            print(f"ValueError: {str(e)}")
            return Response({"error": f"Invalid value: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            import traceback
            print("Traceback:", traceback.format_exc())
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')

        try:
            if user_id is not None:
                user = User.objects.get(id=user_id)
                # First, clean up any invalid cart items
                invalid_items = Q(qty=0) | Q(product__isnull=True) | Q(product__status__in=['draft', 'disabled'])
                Cart.objects.filter(Q(user=user, cart_id=cart_id) | Q(user=user)).filter(invalid_items).delete()
                
                # Then get the remaining valid items
                valid_items = Q(qty__gt=0) & Q(product__isnull=False) & Q(product__status='published')
                queryset = Cart.objects.filter(Q(user=user, cart_id=cart_id) | Q(user=user)).filter(valid_items)
            else:
                # First, clean up any invalid cart items
                invalid_items = Q(qty=0) | Q(product__isnull=True) | Q(product__status__in=['draft', 'disabled'])
                Cart.objects.filter(cart_id=cart_id).filter(invalid_items).delete()
                
                # Then get the remaining valid items
                valid_items = Q(qty__gt=0) & Q(product__isnull=False) & Q(product__status='published')
                queryset = Cart.objects.filter(cart_id=cart_id).filter(valid_items)
            
            return queryset
        except User.DoesNotExist:
            return Cart.objects.none()
    

class CartTotalView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')  # Use get() method to handle the case where user_id is not present

        
        if user_id is not None:
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(cart_id=cart_id, user=user)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)
        
        return queryset
    

class CartDetailView(generics.RetrieveAPIView):
    # Define the serializer class for the view
    serializer_class = CartSerializer
    # Specify the lookup field for retrieving objects using 'cart_id'
    lookup_field = 'cart_id'

    # Add a permission class for the view
    permission_classes = (AllowAny,)


    def get_queryset(self):
        # Get 'cart_id' and 'user_id' from the URL kwargs
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')  # Use get() to handle cases where 'user_id' is not present

        if user_id is not None:
            # If 'user_id' is provided, filter the queryset by both 'cart_id' and 'user_id'
            user = User.objects.get(id=user_id)
            queryset = Cart.objects.filter(cart_id=cart_id, user=user)
        else:
            # If 'user_id' is not provided, filter the queryset by 'cart_id' only
            queryset = Cart.objects.filter(cart_id=cart_id)

        return queryset

    def get(self, request, *args, **kwargs):
        # Get the queryset of cart items based on 'cart_id' and 'user_id' (if provided)
        queryset = self.get_queryset()

        # Initialize sums for various cart item attributes
        total_shipping = 0.0
        total_tax = 0.0
        total_service_fee = 0.0
        total_sub_total = 0.0
        total_total = 0.0

        # Iterate over the queryset of cart items to calculate cumulative sums
        for cart_item in queryset:
            # Calculate the cumulative shipping, tax, service_fee, and total values
            total_shipping += float(self.calculate_shipping(cart_item))
            total_tax += float(self.calculate_tax(cart_item))
            total_service_fee += float(self.calculate_service_fee(cart_item))
            total_sub_total += float(self.calculate_sub_total(cart_item))
            total_total += round(float(self.calculate_total(cart_item)), 2)

        # Create a data dictionary to store the cumulative values
        data = {
            'shipping': round(total_shipping, 2),
            'tax': total_tax,
            'service_fee': total_service_fee,
            'sub_total': total_sub_total,
            'total': total_total,
        }

        # Return the data in the response
        return Response(data)

    def calculate_shipping(self, cart_item):
        # Implement your shipping calculation logic here for a single cart item
        # Example: Calculate based on weight, destination, etc.
        return cart_item.shipping_amount

    def calculate_tax(self, cart_item):
        # Implement your tax calculation logic here for a single cart item
        # Example: Calculate based on tax rate, product type, etc.
        return cart_item.tax_fee

    def calculate_service_fee(self, cart_item):
        # Implement your service fee calculation logic here for a single cart item
        # Example: Calculate based on service type, cart total, etc.
        return cart_item.service_fee

    def calculate_sub_total(self, cart_item):
        # Implement your service fee calculation logic here for a single cart item
        # Example: Calculate based on service type, cart total, etc.
        return cart_item.sub_total

    def calculate_total(self, cart_item):
        # Implement your total calculation logic here for a single cart item
        # Example: Sum of sub_total, shipping, tax, and service_fee
        return cart_item.total
    


class CartItemDeleteView(generics.DestroyAPIView):
    serializer_class = CartSerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        cart_id = self.kwargs['cart_id']
        item_id = self.kwargs['item_id']
        user_id = self.kwargs.get('user_id')

        try:
            if user_id is not None:
                user = User.objects.get(id=user_id)
                cart = Cart.objects.get(cart_id=cart_id, id=item_id, user=user)
            else:
                cart = Cart.objects.get(cart_id=cart_id, id=item_id)
            return cart
        except Cart.DoesNotExist:
            return None

    def delete(self, request, *args, **kwargs):
        cart = self.get_object()
        if cart is None:
            return Response({"message": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)
        
        cart.delete()
        return Response({"message": "Cart item deleted successfully"}, status=status.HTTP_200_OK)


class CartClearView(generics.DestroyAPIView):
    serializer_class = CartSerializer
    permission_classes = (AllowAny,)

    def delete(self, request, *args, **kwargs):
        cart_id = self.kwargs['cart_id']
        user_id = self.kwargs.get('user_id')

        try:
            if user_id is not None:
                user = User.objects.get(id=user_id)
                Cart.objects.filter(Q(user=user, cart_id=cart_id) | Q(user=user)).delete()
            else:
                Cart.objects.filter(cart_id=cart_id).delete()
            
            return Response({"message": "Cart cleared successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateOrderView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    queryset = CartOrder.objects.all()
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        payload = request.data

        full_name = payload['full_name']
        email = payload['email']
        mobile = payload['mobile']
        address = payload['address']
        city = payload['city']
        state = payload['state']
        country = payload['country']
        cart_id = payload['cart_id']
        user_id = payload['user_id']

        print("user_id ===============", user_id)

        if user_id != 0:
            user = User.objects.filter(id=user_id).first()
        else:
            user = None

        cart_items = Cart.objects.filter(cart_id=cart_id)

        total_shipping = Decimal(0.0)
        total_tax = Decimal(0.0)
        total_service_fee = Decimal(0.0)
        total_sub_total = Decimal(0.0)
        total_initial_total = Decimal(0.0)
        total_total = Decimal(0.0)

        with transaction.atomic():

            order = CartOrder.objects.create(
                # sub_total=total_sub_total,
                # shipping_amount=total_shipping,
                # tax_fee=total_tax,
                # service_fee=total_service_fee,
                buyer=user,
                payment_status="processing",
                full_name=full_name,
                email=email,
                mobile=mobile,
                address=address,
                city=city,
                state=state,
                country=country
            )

            for c in cart_items:
                CartOrderItem.objects.create(
                    order=order,
                    product=c.product,
                    qty=c.qty,
                    color=c.color,
                    size=c.size,
                    price=c.price,
                    sub_total=c.sub_total,
                    shipping_amount=c.shipping_amount,
                    tax_fee=c.tax_fee,
                    service_fee=c.service_fee,
                    total=c.total,
                    initial_total=c.total,
                    vendor=c.product.vendor
                )

                total_shipping += Decimal(c.shipping_amount)
                total_tax += Decimal(c.tax_fee)
                total_service_fee += Decimal(c.service_fee)
                total_sub_total += Decimal(c.sub_total)
                total_initial_total += Decimal(c.total)
                total_total += Decimal(c.total)

                order.vendor.add(c.product.vendor)

                

            order.sub_total=total_sub_total
            order.shipping_amount=total_shipping
            order.tax_fee=total_tax
            order.service_fee=total_service_fee
            order.initial_total=total_initial_total
            order.total=total_total

            
            order.save()

        return Response( {"message": "Order Created Successfully", 'order_oid':order.oid}, status=status.HTTP_201_CREATED)


class CreateSubscriptionOrderView(generics.CreateAPIView):
    """
    Create a subscription order without requiring cart items.
    This endpoint creates an order directly for subscription plans.
    """
    permission_classes = (AllowAny,)
    
    def create(self, request, *args, **kwargs):
        payload = request.data
        
        # Get subscription plan details
        plan_name = payload.get('plan_name', '')
        plan_price = Decimal(payload.get('plan_price', 0))
        
        # Subscription plan prices
        plan_prices = {
            'basic': Decimal('0.00'),
            'premium': Decimal('9.99'),
            'enterprise': Decimal('49.99')
        }
        
        # Use provided price or get from plan name
        if plan_price == 0 and plan_name.lower() in plan_prices:
            plan_price = plan_prices[plan_name.lower()]
        
        # Get user information (optional - can be filled later in checkout)
        full_name = payload.get('full_name', '')
        email = payload.get('email', '')
        mobile = payload.get('mobile', '')
        address = payload.get('address', '')
        city = payload.get('city', '')
        state = payload.get('state', '')
        country = payload.get('country', '')
        user_id = payload.get('user_id', 0)
        
        if user_id != 0:
            user = User.objects.filter(id=user_id).first()
        else:
            user = None
        
        # Calculate totals for subscription
        sub_total = plan_price
        shipping_amount = Decimal('0.00')  # Subscriptions typically don't have shipping
        tax_fee = Decimal('0.00')  # Can be calculated later if needed
        service_fee = Decimal('0.00')  # Can be calculated later if needed
        total = sub_total + shipping_amount + tax_fee + service_fee
        
        with transaction.atomic():
            # Create the subscription order
            order = CartOrder.objects.create(
                buyer=user,
                payment_status="processing",
                full_name=full_name,
                email=email,
                mobile=mobile,
                address=address,
                city=city,
                state=state,
                country=country,
                sub_total=sub_total,
                shipping_amount=shipping_amount,
                tax_fee=tax_fee,
                service_fee=service_fee,
                total=total,
                initial_total=total,
            )
            
            # Store subscription plan info in order (we can add a note field or use existing fields)
            # For now, we'll store it in the address field as a note, or we could add a subscription_plan field to the model
            # But to keep it simple, we'll just create the order and the plan info can be stored separately if needed
        
        return Response({
            "message": "Subscription Order Created Successfully",
            'order_oid': order.oid
        }, status=status.HTTP_201_CREATED)


class CheckoutView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    lookup_field = 'order_oid'  

    def get_object(self):
        order_oid = self.kwargs['order_oid']
        cart = get_object_or_404(CartOrder, oid=order_oid)
        return cart
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        # Check if this is a subscription order (no order items)
        from store.models import CartOrderItem
        order_items_count = CartOrderItem.objects.filter(order=instance).count()
        is_subscription = order_items_count == 0
        
        data = serializer.data
        data['is_subscription'] = is_subscription
        return Response(data)
    

class CouponApiView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer

    def create(self, request, *args, **kwargs):
        payload = request.data

        order_oid = payload['order_oid']
        coupon_code = payload['coupon_code']
        print("order_oid =======", order_oid)
        print("coupon_code =======", coupon_code)

        order = CartOrder.objects.get(oid=order_oid)
        coupon = Coupon.objects.filter(code__iexact=coupon_code, active=True).first()
        
        if coupon:
            order_items = CartOrderItem.objects.filter(order=order, vendor=coupon.vendor)
            if order_items:
                for i in order_items:
                    print("order_items =====", i.product.title)
                    if not coupon in i.coupon.all():
                        discount = i.total * coupon.discount / 100
                        
                        i.total -= discount
                        i.sub_total -= discount
                        i.coupon.add(coupon)
                        i.saved += discount
                        i.applied_coupon = True

                        order.total -= discount
                        order.sub_total -= discount
                        order.saved += discount

                        i.save()
                        order.save()
                        return Response( {"message": "Coupon Activated"}, status=status.HTTP_200_OK)
                    else:
                        return Response( {"message": "Coupon Already Activated"}, status=status.HTTP_200_OK)
            return Response( {"message": "Order Item Does Not Exists"}, status=status.HTTP_200_OK)
        else:
            return Response( {"message": "Coupon Does Not Exists"}, status=status.HTTP_404_NOT_FOUND)


    


class StripeCheckoutView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer

    def create(self, request, *args, **kwargs):
        order_oid = self.kwargs['order_oid']
        order = CartOrder.objects.filter(oid=order_oid).first()

        if not order:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)


        try:
            # Get email from order or user
            customer_email = None
            if order.email and order.email.strip():
                customer_email = order.email.strip()
            elif order.buyer and order.buyer.email:
                customer_email = order.buyer.email
            
            # Build checkout session parameters
            session_params = {
                'payment_method_types': ['card'],
                'line_items': [
                    {
                        'price_data': {
                            'currency': 'usd',
                            'product_data': {
                                'name': order.full_name or 'Order',
                            },
                            'unit_amount': int(order.total * 100),
                        },
                        'quantity': 1,
                    }
                ],
                'mode': 'payment',
                'success_url': settings.SITE_URL+'/payment-success/'+ order.oid +'?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url': settings.SITE_URL+'/?session_id={CHECKOUT_SESSION_ID}',
            }
            
            # Only include customer_email if we have a valid email
            if customer_email:
                session_params['customer_email'] = customer_email
            
            checkout_session = stripe.checkout.Session.create(**session_params)
            order.stripe_session_id = checkout_session.id 
            order.save()

            return redirect(checkout_session.url)
        except stripe.error.StripeError as e:
            return Response( {'error': f'Something went wrong when creating stripe checkout session: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_access_token(client_id, secret_key):
    # Function to get access token from PayPal API
    token_url = 'https://api.sandbox.paypal.com/v1/oauth2/token'
    data = {'grant_type': 'client_credentials'}
    auth = (client_id, secret_key)
    response = requests.post(token_url, data=data, auth=auth)

    if response.status_code == 200:
        print("access_token ====", response.json()['access_token'])
        return response.json()['access_token']
    else:
        raise Exception(f'Failed to get access token from PayPal. Status code: {response.status_code}') 

    
class PaymentSuccessView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    queryset = CartOrder.objects.all()
    
    
    def create(self, request, *args, **kwargs):
        payload = request.data
        
        order_oid = payload['order_oid']
        session_id = payload['session_id']
        payapl_order_id = payload['payapl_order_id']

        order = CartOrder.objects.get(oid=order_oid)
        order_items = CartOrderItem.objects.filter(order=order)

        if payapl_order_id != "null":
            paypal_api_url = f'https://api-m.sandbox.paypal.com/v2/checkout/orders/{payapl_order_id}'
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {get_access_token(PAYPAL_CLIENT_ID, PAYPAL_SECRET_ID)}',
            }
            response = requests.get(paypal_api_url, headers=headers)

            if response.status_code == 200:
                paypal_order_data = response.json()
                paypal_payment_status = paypal_order_data['status']
                if paypal_payment_status == 'COMPLETED':
                    if order.payment_status == "processing":
                        order.payment_status = "paid"
                        order.save()
                        if order.buyer != None:
                            send_notification(user=order.buyer, order=order)

                        merge_data = {
                            'order': order, 
                            'order_items': order_items, 
                        }
                        subject = f"Order Placed Successfully"
                        text_body = render_to_string("email/customer_order_confirmation.txt", merge_data)
                        html_body = render_to_string("email/customer_order_confirmation.html", merge_data)
                        
                        msg = EmailMultiAlternatives(
                            subject=subject, from_email=settings.FROM_EMAIL,
                            to=[order.email], body=text_body
                        )
                        msg.attach_alternative(html_body, "text/html")
                        msg.send()

                        for o in order_items:
                            send_notification(vendor=o.vendor, order=order, order_item=o)
                            
                            merge_data = {
                                'order': order, 
                                'order_items': order_items, 
                            }
                            subject = f"New Sale!"
                            text_body = render_to_string("email/vendor_order_sale.txt", merge_data)
                            html_body = render_to_string("email/vendor_order_sale.html", merge_data)
                            
                            msg = EmailMultiAlternatives(
                                subject=subject, from_email=settings.FROM_EMAIL,
                                to=[o.vendor.email], body=text_body
                            )
                            msg.attach_alternative(html_body, "text/html")
                            msg.send()

                        return Response( {"message": "Payment Successfull"}, status=status.HTTP_201_CREATED)
                    else:
                        
                        return Response( {"message": "Already Paid"}, status=status.HTTP_201_CREATED)
            

        # Process Stripe Payment
        if session_id != "null":
            session = stripe.checkout.Session.retrieve(session_id)

            if session.payment_status == "paid":
                if order.payment_status == "processing":
                    order.payment_status = "paid"
                    order.save()

                    if order.buyer != None:
                        send_notification(user=order.buyer, order=order)
                    for o in order_items:
                        send_notification(vendor=o.vendor, order=order, order_item=o)

                    return Response( {"message": "Payment Successfull"}, status=status.HTTP_201_CREATED)
                else:
                    return Response( {"message": "Already Paid"}, status=status.HTTP_201_CREATED)
                
            elif session.payment_status == "unpaid":
                return Response( {"message": "unpaid!"}, status=status.HTTP_402_PAYMENT_REQUIRED)
            elif session.payment_status == "canceled":
                return Response( {"message": "cancelled!"}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response( {"message": "An Error Occured!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            session = None


class ReviewRatingAPIView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()
    permission_classes = (AllowAny, )

    def create(self, request, *args, **kwargs):
        payload = request.data

        user_id = payload['user_id']
        product_id = payload['product_id']
        rating = payload['rating']
        review = payload['review']

        user = User.objects.get(id=user_id)
        product = Product.objects.get(id=product_id)

        Review.objects.create(user=user, product=product, rating=rating, review=review)
    
        return Response( {"message": "Review Created Successfully."}, status=status.HTTP_201_CREATED)



class ReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = (AllowAny, )

    def get_queryset(self):
        product_id = self.kwargs['product_id']

        product = Product.objects.get(id=product_id)
        reviews = Review.objects.filter(product=product)
        return reviews
    
class SearchProductsAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        query = self.request.GET.get('query')
        print("query =======", query)

        products = Product.objects.filter(status="published", title__icontains=query)
        return products

class CategoryDetailView(generics.RetrieveAPIView):
    serializer_class = CategorySerializer
    permission_classes = (AllowAny,)

    def get_object(self):
        slug = self.kwargs.get('slug')
        category = get_object_or_404(Category, slug=slug, active=True)
        return category

class RegisterView(APIView):
    def post(self, request):
        # Your registration logic here
        return Response({"message": "User registered"}, status=status.HTTP_201_CREATED)
       