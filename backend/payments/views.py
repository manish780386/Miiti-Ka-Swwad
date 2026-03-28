import razorpay
import hmac
import hashlib
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from .models import Payment
from orders.models import Order


def get_razorpay_client():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


class CreatePaymentOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        order = get_object_or_404(Order, id=order_id, user=request.user)

        if order.payment_status == 'paid':
            return Response({'error': 'Order already paid'}, status=status.HTTP_400_BAD_REQUEST)

        client = get_razorpay_client()
        amount_paise = int(order.total_amount * 100)  # Razorpay uses paise

        razorpay_order = client.order.create({
            'amount': amount_paise,
            'currency': 'INR',
            'receipt': f'order_{order.id}',
            'notes': {
                'order_id': str(order.id),
                'user_email': request.user.email,
            }
        })

        payment, _ = Payment.objects.update_or_create(
            order=order,
            defaults={
                'user': request.user,
                'razorpay_order_id': razorpay_order['id'],
                'amount': order.total_amount,
                'status': 'created',
            }
        )

        return Response({
            'razorpay_order_id': razorpay_order['id'],
            'razorpay_key': settings.RAZORPAY_KEY_ID,
            'amount': amount_paise,
            'currency': 'INR',
            'order_id': order.id,
            'name': 'Mitti Ka Swad',
            'description': f'Order #{order.id}',
            'prefill': {
                'name': request.user.full_name,
                'email': request.user.email,
                'contact': request.user.phone,
            }
        })


class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')

        payment = get_object_or_404(Payment, razorpay_order_id=razorpay_order_id)

        # Signature verification
        body = f'{razorpay_order_id}|{razorpay_payment_id}'
        expected_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            body.encode(),
            hashlib.sha256
        ).hexdigest()

        if expected_signature == razorpay_signature:
            payment.razorpay_payment_id = razorpay_payment_id
            payment.razorpay_signature = razorpay_signature
            payment.status = 'paid'
            payment.save()

            order = payment.order
            order.payment_status = 'paid'
            order.status = 'confirmed'
            order.save()

            # Update food item order counts
            for item in order.items.all():
                if item.food_item:
                    item.food_item.total_orders += item.quantity
                    item.food_item.save(update_fields=['total_orders'])

            return Response({
                'message': 'Payment verified! Your order is confirmed.',
                'order_id': order.id,
                'payment_id': razorpay_payment_id,
            })
        else:
            payment.status = 'failed'
            payment.save()
            payment.order.payment_status = 'failed'
            payment.order.save()
            return Response({'error': 'Payment verification failed'}, status=status.HTTP_400_BAD_REQUEST)


class PaymentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        payment = get_object_or_404(Payment, order__id=order_id, user=request.user)
        return Response({
            'razorpay_order_id': payment.razorpay_order_id,
            'razorpay_payment_id': payment.razorpay_payment_id,
            'amount': float(payment.amount),
            'status': payment.status,
            'created_at': payment.created_at,
        })