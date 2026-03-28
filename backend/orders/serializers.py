from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem
from foods.serializers import FoodItemListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    food_item_detail = FoodItemListSerializer(source='food_item', read_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'food_item', 'food_item_detail', 'quantity', 'subtotal', 'added_at']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_price', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'food_name', 'food_price', 'quantity', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    delivery_address_detail = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'subtotal', 'total_amount', 'status', 'payment_status']

    def get_delivery_address_detail(self, obj):
        if obj.delivery_address:
            return {
                'street': obj.delivery_address.street,
                'city': obj.delivery_address.city,
                'state': obj.delivery_address.state,
                'pincode': obj.delivery_address.pincode,
            }
        return None