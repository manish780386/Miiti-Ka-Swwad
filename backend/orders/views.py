import logging
from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, OrderItem
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer
from foods.models import FoodItem

logger = logging.getLogger(__name__)


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart, context={'request': request}).data)


class CartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        food_item_id = request.data.get('food_item_id')
        quantity = int(request.data.get('quantity', 1))

        food_item = get_object_or_404(FoodItem, id=food_item_id, is_available=True)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, food_item=food_item)
        cart_item.quantity = cart_item.quantity + quantity if not created else quantity
        cart_item.save()

        return Response({
            'message': 'Added to cart!',
            'cart': CartSerializer(cart, context={'request': request}).data
        })

    def patch(self, request, item_id):
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        quantity = int(request.data.get('quantity', 1))

        if quantity <= 0:
            cart_item.delete()
            return Response({'message': 'Item removed from cart'})

        cart_item.quantity = quantity
        cart_item.save()
        return Response(CartSerializer(cart, context={'request': request}).data)

    def delete(self, request, item_id):
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()
        return Response({'message': 'Removed from cart'}, status=status.HTTP_204_NO_CONTENT)


class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            cart = get_object_or_404(Cart, user=request.user)

            if not cart.items.exists():
                return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

            address_id = request.data.get('address_id')
            if not address_id:
                return Response({'error': 'address_id is required'}, status=status.HTTP_400_BAD_REQUEST)

            special_instructions = request.data.get('special_instructions', '')
            is_family_order      = request.data.get('is_family_order', False)
            family_size          = request.data.get('family_size', None)

            from users.models import Address
            address = get_object_or_404(Address, id=address_id, user=request.user)

            # All Decimal — no int/float mixing
            subtotal     = Decimal(str(cart.total_price))
            delivery_fee = Decimal('40.00')
            total        = subtotal + delivery_fee

            order = Order.objects.create(
                user=request.user,
                delivery_address=address,
                subtotal=subtotal,
                delivery_fee=delivery_fee,
                total_amount=total,
                special_instructions=special_instructions,
                is_family_order=bool(is_family_order),
                family_size=family_size,
            )

            for cart_item in cart.items.select_related('food_item', 'food_item__vendor').all():
                OrderItem.objects.create(
                    order=order,
                    food_item=cart_item.food_item,
                    food_name=cart_item.food_item.name,
                    food_price=Decimal(str(cart_item.food_item.effective_price)),
                    quantity=cart_item.quantity,
                    vendor=cart_item.food_item.vendor,
                )

            cart.items.all().delete()

            return Response({
                'order_id':     order.id,
                'total_amount': float(order.total_amount),
                'message':      'Order created. Proceed to payment.',
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.exception("Checkout error for user %s", request.user.id)
            return Response(
                {'error': f'Checkout failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class OrderListView(generics.ListAPIView):
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)