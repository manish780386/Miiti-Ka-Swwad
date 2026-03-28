from decimal import Decimal
from django.db import models
from users.models import User, Address
from foods.models import FoodItem


class Cart(models.Model):
    user       = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'carts'

    @property
    def total_items(self):
        return self.items.aggregate(total=models.Sum('quantity'))['total'] or 0

    @property
    def total_price(self):
        # FIX: start with Decimal so Decimal+Decimal never mixes with int/float
        total = Decimal('0.00')
        for item in self.items.all():
            total += item.subtotal
        return total


class CartItem(models.Model):
    cart      = models.ForeignKey(Cart,     on_delete=models.CASCADE, related_name='items')
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    quantity  = models.PositiveIntegerField(default=1)
    added_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table       = 'cart_items'
        unique_together = ['cart', 'food_item']

    @property
    def subtotal(self):
        return self.food_item.effective_price * self.quantity


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending',          'Pending'),
        ('confirmed',        'Confirmed'),
        ('preparing',        'Preparing'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered',        'Delivered'),
        ('cancelled',        'Cancelled'),
    ]
    PAYMENT_STATUS = [
        ('pending',  'Pending'),
        ('paid',     'Paid'),
        ('failed',   'Failed'),
        ('refunded', 'Refunded'),
    ]

    user             = models.ForeignKey(User,    on_delete=models.SET_NULL, null=True, related_name='orders')
    delivery_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True)

    subtotal     = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=6,  decimal_places=2, default=Decimal('40.00'))
    discount     = models.DecimalField(max_digits=8,  decimal_places=2, default=Decimal('0.00'))
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    status         = models.CharField(max_length=20, choices=STATUS_CHOICES,  default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS,  default='pending')

    special_instructions = models.TextField(blank=True)
    is_family_order      = models.BooleanField(default=False)
    family_size          = models.IntegerField(null=True, blank=True)

    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)
    estimated_delivery= models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']

    def __str__(self):
        return f'Order #{self.id} by {self.user}'


class OrderItem(models.Model):
    order      = models.ForeignKey(Order,    on_delete=models.CASCADE,   related_name='items')
    food_item  = models.ForeignKey(FoodItem, on_delete=models.SET_NULL,  null=True)
    food_name  = models.CharField(max_length=200)
    food_price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity   = models.IntegerField()
    vendor     = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='vendor_order_items')

    class Meta:
        db_table = 'order_items'

    @property
    def subtotal(self):
        return self.food_price * self.quantity