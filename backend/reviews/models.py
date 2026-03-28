from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User
from foods.models import FoodItem


class Review(models.Model):
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField()
    image = models.ImageField(upload_to='reviews/', null=True, blank=True)
    is_verified_purchase = models.BooleanField(default=False)
    helpful_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reviews'
        unique_together = ['food_item', 'user']
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.full_name} — {self.food_item.name} ({self.rating}★)'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self._update_food_rating()

    def _update_food_rating(self):
        from django.db.models import Avg, Count
        agg = Review.objects.filter(food_item=self.food_item).aggregate(
            avg=Avg('rating'), count=Count('id')
        )
        self.food_item.average_rating = round(agg['avg'] or 0, 2)
        self.food_item.review_count = agg['count']
        self.food_item.save(update_fields=['average_rating', 'review_count'])