from django.urls import path
from .views import CreatePaymentOrderView, VerifyPaymentView, PaymentDetailView

urlpatterns = [
    path('create/', CreatePaymentOrderView.as_view(), name='payment-create'),
    path('verify/', VerifyPaymentView.as_view(), name='payment-verify'),
    path('<int:order_id>/', PaymentDetailView.as_view(), name='payment-detail'),
]