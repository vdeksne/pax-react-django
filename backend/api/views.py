from rest_framework import generics
from store.models import Product, Specification, Color, Size, Gallery, Vendor
from store.serializers import ProductSerializer, SpecificationSerializer, ColorSerializer, SizeSerializer, GallerySerializer
from rest_framework.permissions import AllowAny
from django.db import transaction
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import requests

class ProductUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny, )  # Adjust permission classes as needed

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        product_pid = self.kwargs['product_pid']

        vendor = Vendor.objects.get(id=vendor_id)
        product = Product.objects.get(vendor=vendor, pid=product_pid)
        return product
    
    def perform_update(self, serializer):
        serializer.is_valid(raise_exception=True)
        serializer.save()
        product_instance = serializer.instance

        specifications_data = []
        colors_data = []
        sizes_data = []
        gallery_data = []
        # Loop through the keys of self.request.data
        for key, value in self.request.data.items():
        # Example key: specifications[0][title]
            if key.startswith('specifications') and '[title]' in key:
                # Extract index from key
                index = key.split('[')[1].split(']')[0]
                title = value
                content_key = f'specifications[{index}][content]'
                content = self.request.data.get(content_key)
                specifications_data.append({'title': title, 'content': content})

            # Example key: colors[0][name]
            elif key.startswith('colors') and '[name]' in key:
                # Extract index from key
                index = key.split('[')[1].split(']')[0]
                name = value
                color_code_key = f'colors[{index}][color_code]'
                color_code = self.request.data.get(color_code_key)
                image_key = f'colors[{index}][image]'
                image = self.request.data.get(image_key)
                colors_data.append({'name': name, 'color_code': color_code, 'image': image})

            # Example key: sizes[0][name]
            elif key.startswith('sizes') and '[name]' in key:
                # Extract index from key
                index = key.split('[')[1].split(']')[0]
                name = value
                price_key = f'sizes[{index}][price]'
                price = self.request.data.get(price_key)
                sizes_data.append({'name': name, 'price': price})

            # Example key: gallery[0][image]
            elif key.startswith('gallery') and '[image]' in key:
                # Extract index from key
                index = key.split('[')[1].split(']')[0]
                image = value
                gallery_data.append({'image': image})

        # Log or print the data for debugging
        print('specifications_data:', specifications_data)
        print('colors_data:', colors_data)
        print('sizes_data:', sizes_data)
        print('gallery_data:', gallery_data)

        # Save nested serializers with the product instance
        self.save_nested_data(product_instance, SpecificationSerializer, specifications_data)
        self.save_nested_data(product_instance, ColorSerializer, colors_data)
        self.save_nested_data(product_instance, SizeSerializer, sizes_data)
        self.save_nested_data(product_instance, GallerySerializer, gallery_data)

    def save_nested_data(self, product_instance, serializer_class, data):
        serializer = serializer_class(data=data, many=True, context={'product_instance': product_instance})
        serializer.is_valid(raise_exception=True)
        serializer.save(product=product_instance)


class ProductUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (AllowAny, )  # Adjust permission classes as needed

    def get_object(self):
        vendor_id = self.kwargs['vendor_id']
        product_pid = self.kwargs['product_pid']

        vendor = Vendor.objects.get(id=vendor_id)
        product = Product.objects.get(vendor=vendor, pid=product_pid)
        return product
    
    @transaction.atomic
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        print("serializer.instance ===", serializer.instance)
        product_instance = serializer.instance


        # Parse and process nested data
        specifications_data = []
        colors_data = []
        sizes_data = []
        gallery_data = []

        for key, value in self.request.data.items():
            # Process specifications data
            if key.startswith('specifications') and '[title]' in key:
                index = key.split('[')[1].split(']')[0]
                title = value
                content_key = f'specifications[{index}][content]'
                content = self.request.data.get(content_key)
                specifications_data.append({'title': title, 'content': content})

            # Process colors data
            elif key.startswith('colors') and '[name]' in key:
                index = key.split('[')[1].split(']')[0]
                name = value
                color_code_key = f'colors[{index}][color_code]'
                color_code = self.request.data.get(color_code_key)
                image_key = f'colors[{index}][image]'
                image = self.request.data.get(image_key)
                colors_data.append({'name': name, 'color_code': color_code, 'image': image})

            # Process sizes data
            elif key.startswith('sizes') and '[name]' in key:
                index = key.split('[')[1].split(']')[0]
                name = value
                price_key = f'sizes[{index}][price]'
                price = self.request.data.get(price_key)
                sizes_data.append({'name': name, 'price': price})

            # Process gallery data
            elif key.startswith('gallery') and '[image]' in key:
                index = key.split('[')[1].split(']')[0]
                image = value
                gallery_data.append({'image': image})

        # Log or print the data for debugging
        print('specifications_data:', specifications_data)
        print('colors_data:', colors_data)
        print('sizes_data:', sizes_data)
        print('gallery_data:', gallery_data)
        
        

        # Retrieve existing data from the database
        existing_specifications = instance.specification_set.all().values('id', 'title', 'content')
        existing_colors = instance.color_set.all().values('id', 'name', 'color_code', 'image')
        existing_sizes = instance.size_set.all().values('id', 'name', 'price')
        existing_gallery = instance.gallery_set.all().values('id', 'image')

        # Compare existing data with new data and update accordingly
        self.update_nested_data(existing_specifications, specifications_data, Specification, product_instance)
        self.update_nested_data(existing_colors, colors_data, Color, product_instance)
        self.update_nested_data(existing_sizes, sizes_data, Size, product_instance)
        self.update_nested_data(existing_gallery, gallery_data, Gallery, product_instance)

        # Continue with the main update
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def update_nested_data(self, existing_data, new_data, product_instance, model):
        existing_ids = [item['id'] for item in existing_data]

        # Update existing data
        for item in new_data:
            item_id = item.get('id')

            if item_id and item_id in existing_ids:
                existing_instance = model.objects.get(id=item_id, product=product_instance)  # Use Product.objects to access the related model
                existing_instance.title = item['title']
                existing_instance.content = item['content']
                existing_instance.save()

        # Create new data
        new_items = [item for item in new_data if item.get('id') is None]
        model.objects.bulk_create([model(**item, product=product_instance) for item in new_items])

        # Delete missing data
        missing_ids = set(existing_ids) - set([item.get('id') for item in new_data])
        model.objects.filter(id__in=missing_ids).delete()
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        print("instance ===", instance)
        print(request.data.items)

        
        # Handle nested data updates (specifications, colors, sizes, gallery)
        self.update_nested_data(instance, request.data.get('specifications', []), SpecificationSerializer)
        self.update_nested_data(instance, request.data.get('colors', []), ColorSerializer)
        self.update_nested_data(instance, request.data.get('sizes', []), SizeSerializer)
        self.update_nested_data(instance, request.data.get('gallery', []), GallerySerializer)

        # Continue with the main update
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)

    def update_nested_data(self, product_instance, data, serializer_class):
        # Update existing or create new nested objects
        serializer = serializer_class(data=data, many=True, context={'product_instance': product_instance})
        serializer.is_valid(raise_exception=True)
        serializer.save(product=product_instance)


    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    

    
    def perform_update(self, serializer):
        serializer.is_valid(raise_exception=True)
        serializer.save()
        product_instance = serializer.instance

        specifications_data = []
        colors_data = []
        sizes_data = []
        gallery_data = []
        # Loop through the keys of self.request.data
        for key, value in self.request.data.items():
        # Example key: specifications[0][title]
            if key.startswith('specifications') and '[title]' in key:
                # Extract index from key
                index = key.split('[')[1].split(']')[0]
                title = value
                content_key = f'specifications[{index}][content]'
                content = self.request.data.get(content_key)
                specifications_data.append({'title': title, 'content': content})

            # Example key: colors[0][name]
            elif key.startswith('colors') and '[name]' in key:
                # Extract index from key
                index = key.split('[')[1].split(']')[0]
                name = value
                color_code_key = f'colors[{index}][color_code]'
                color_code = self.request.data.get(color_code_key)
                image_key = f'colors[{index}][image]'
                image = self.request.data.get(image_key)
                colors_data.append({'name': name, 'color_code': color_code, 'image': image})

            # Example key: sizes[0][name]
            elif key.startswith('sizes') and '[name]' in key:
                # Extract index from key
                index = key.split('[')[1].split(']')[0]
                name = value
                price_key = f'sizes[{index}][price]'
                price = self.request.data.get(price_key)
                sizes_data.append({'name': name, 'price': price})

            # Example key: gallery[0][image]
            elif key.startswith('gallery') and '[image]' in key:
                # Extract index from key
                index = key.split('[')[1].split(']')[0]
                image = value
                gallery_data.append({'image': image})

        # Log or print the data for debugging
        print('specifications_data:', specifications_data)
        print('colors_data:', colors_data)
        print('sizes_data:', sizes_data)
        print('gallery_data:', gallery_data)

        # Save nested serializers with the product instance
        self.save_nested_data(product_instance, SpecificationSerializer, specifications_data)
        self.save_nested_data(product_instance, ColorSerializer, colors_data)
        self.save_nested_data(product_instance, SizeSerializer, sizes_data)
        self.save_nested_data(product_instance, GallerySerializer, gallery_data)
    
    def save_nested_data(self, product_instance, serializer_class, data):
        serializer = serializer_class(data=data, many=True, context={'product_instance': product_instance})
        serializer.is_valid(raise_exception=True)
        serializer.save(product=product_instance)

class RegisterView(APIView):
    def post(self, request):
        # Dummy implementation, replace with real registration logic if needed
        return Response({"message": "User registered"}, status=status.HTTP_201_CREATED)


class GeocodeReverseView(APIView):
    """
    Proxy endpoint for reverse geocoding using Nominatim API.
    This avoids CORS issues when calling Nominatim from the frontend.
    """
    permission_classes = (AllowAny,)

    def get(self, request):
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')

        if not lat or not lon:
            return Response(
                {"error": "Latitude and longitude are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Validate lat/lon are numeric
            try:
                lat_float = float(lat)
                lon_float = float(lon)
            except (ValueError, TypeError):
                return Response(
                    {"error": "Invalid latitude or longitude format"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Call Nominatim API from backend (no CORS issues)
            # Nominatim requires a proper User-Agent and recommends adding email
            url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=18&addressdetails=1"
            headers = {
                "User-Agent": "PaxConnect/1.0 (Contact: support@paxconnect.com)",  # Nominatim requires User-Agent
                "Accept": "application/json",
                "Accept-Language": "en-US,en;q=0.9"
            }
            
            response = requests.get(url, headers=headers, timeout=15)
            
            # Check if response is successful
            if response.status_code == 200:
                try:
                    data = response.json()
                    return Response(data, status=status.HTTP_200_OK)
                except ValueError as json_error:
                    # JSON decode error
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.error(f"Failed to parse Nominatim JSON response: {str(json_error)}")
                    return Response(
                        {"error": "Invalid JSON response from geocoding service", "type": "json_decode_error"},
                        status=status.HTTP_502_BAD_GATEWAY
                    )
            elif response.status_code == 429:
                # Rate limited - return a more helpful error
                return Response(
                    {"error": "Geocoding service is temporarily unavailable. Please try again later."},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            else:
                # Other HTTP errors
                return Response(
                    {"error": f"Geocoding service returned status {response.status_code}"},
                    status=status.HTTP_502_BAD_GATEWAY
                )
            
        except requests.exceptions.Timeout:
            return Response(
                {"error": "Geocoding service request timed out"},
                status=status.HTTP_504_GATEWAY_TIMEOUT
            )
        except requests.exceptions.ConnectionError:
            return Response(
                {"error": "Unable to connect to geocoding service"},
                status=status.HTTP_502_BAD_GATEWAY
            )
        except requests.exceptions.RequestException as e:
            # Log detailed error information
            import logging
            logger = logging.getLogger(__name__)
            error_msg = f"Geocoding service error: {str(e)}"
            logger.error(error_msg, exc_info=True)
            return Response(
                {"error": error_msg, "type": "request_exception"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except ValueError as e:
            # JSON decode error
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"JSON decode error: {str(e)}", exc_info=True)
            return Response(
                {"error": "Invalid response from geocoding service", "type": "json_decode_error", "details": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )
        except Exception as e:
            # Log the full error for debugging
            import logging
            import traceback
            logger = logging.getLogger(__name__)
            error_trace = traceback.format_exc()
            logger.error(f"Geocode unexpected error: {str(e)}\n{error_trace}", exc_info=True)
            # Return detailed error in response for debugging
            return Response(
                {
                    "error": f"Unexpected error: {str(e)}",
                    "type": type(e).__name__,
                    "details": str(e) if str(e) else "No details available"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
