from django.db import models
from users.models import User


class VendorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='vendor_profile')
    shop_name = models.CharField(max_length=200)
    tagline = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    shop_image = models.ImageField(upload_to='vendors/', null=True, blank=True)
    region = models.CharField(max_length=50, blank=True)
    village_or_city = models.CharField(max_length=100, blank=True)
    speciality = models.CharField(max_length=300, blank=True)
    is_verified = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_orders = models.IntegerField(default=0)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'vendor_profiles'

    def __str__(self):
        return f'{self.shop_name} — {self.user.full_name}'