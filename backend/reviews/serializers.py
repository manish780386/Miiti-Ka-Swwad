from rest_framework import serializers, generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_image = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'food_item', 'user', 'user_name', 'user_image',
            'rating', 'title', 'comment', 'image',
            'is_verified_purchase', 'helpful_count', 'created_at'
        ]
        read_only_fields = ['user', 'is_verified_purchase', 'helpful_count']

    def get_user_image(self, obj):
        if obj.user.profile_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.user.profile_image.url) if request else None
        return None

    def validate(self, attrs):
        request = self.context.get('request')
        food_item = attrs.get('food_item')
        if Review.objects.filter(food_item=food_item, user=request.user).exists():
            raise ValidationError('You have already reviewed this dish.')
        return attrs

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        # Check if user has ordered this item
        from orders.models import OrderItem
        has_ordered = OrderItem.objects.filter(
            order__user=validated_data['user'],
            food_item=validated_data['food_item'],
            order__payment_status='paid'
        ).exists()
        validated_data['is_verified_purchase'] = has_ordered
        return super().create(validated_data)


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        food_slug = self.kwargs.get('food_slug')
        return Review.objects.filter(
            food_item__slug=food_slug
        ).select_related('user')