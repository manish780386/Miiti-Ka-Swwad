from rest_framework import serializers
from .models import FoodItem, FoodImage, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = '__all__'


class FoodImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = FoodImage
        fields = ['id', 'image', 'caption', 'is_primary']


class FoodItemListSerializer(serializers.ModelSerializer):
    primary_image  = serializers.SerializerMethodField()
    vendor_name    = serializers.CharField(source='vendor.full_name',            read_only=True)
    category_name  = serializers.CharField(source='category.name',               read_only=True)
    region_display = serializers.CharField(source='get_region_display',          read_only=True)
    festival_display = serializers.CharField(source='get_festival_tag_display',  read_only=True)

    class Meta:
        model  = FoodItem
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'discounted_price',
            'food_type', 'region', 'region_display', 'festival_tag', 'festival_display',
            'primary_image', 'vendor_name', 'category_name',
            'average_rating', 'review_count', 'total_orders',
            'is_available', 'is_featured', 'prep_time_minutes', 'serves',
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            request = self.context.get('request')
            return request.build_absolute_uri(img.image.url) if request else img.image.url
        return None


class FoodItemDetailSerializer(serializers.ModelSerializer):
    images           = FoodImageSerializer(many=True, read_only=True)
    vendor_name      = serializers.CharField(source='vendor.full_name',           read_only=True)
    vendor_id        = serializers.IntegerField(source='vendor.id',               read_only=True)
    category         = CategorySerializer(read_only=True)
    region_display   = serializers.CharField(source='get_region_display',         read_only=True)
    festival_display = serializers.CharField(source='get_festival_tag_display',   read_only=True)
    ingredients_list = serializers.SerializerMethodField()

    class Meta:
        model  = FoodItem
        fields = '__all__'

    def get_ingredients_list(self, obj):
        return [i.strip() for i in obj.ingredients.split(',') if i.strip()]


class FoodItemCreateSerializer(serializers.ModelSerializer):
    """Used for both CREATE and UPDATE (PATCH) of vendor food items."""

    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model   = FoodItem
        exclude = ['vendor', 'total_orders', 'average_rating', 'review_count']
        # slug is auto-generated on create; on PATCH it is optional
        extra_kwargs = {
            'slug':        {'required': False},
            'cultural_story': {'required': False},
            'cooking_method': {'required': False},
            'ingredients':    {'required': False},
            'category':       {'required': False, 'allow_null': True},
        }

    def create(self, validated_data):
        images = validated_data.pop('images', [])
        food   = FoodItem.objects.create(**validated_data)
        for i, image in enumerate(images):
            FoodImage.objects.create(food=food, image=image, is_primary=(i == 0))
        return food

    def update(self, instance, validated_data):
        # Remove images from validated_data for separate handling
        images = validated_data.pop('images', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        # If new images were uploaded, add them
        if images:
            # Mark old primary as not primary
            instance.images.filter(is_primary=True).update(is_primary=False)
            for i, image in enumerate(images):
                FoodImage.objects.create(food=instance, image=image, is_primary=(i == 0))
        return instance