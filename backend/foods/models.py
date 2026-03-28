from django.db import models
from users.models import User


INDIAN_REGIONS = [
    ('madhya_pradesh', 'Madhya Pradesh'),
    ('rajasthan', 'Rajasthan'),
    ('punjab', 'Punjab'),
    ('bihar', 'Bihar'),
    ('uttar_pradesh', 'Uttar Pradesh'),
    ('gujarat', 'Gujarat'),
    ('maharashtra', 'Maharashtra'),
    ('kerala', 'Kerala'),
    ('tamil_nadu', 'Tamil Nadu'),
    ('bengal', 'West Bengal'),
    ('odisha', 'Odisha'),
    ('karnataka', 'Karnataka'),
    ('andhra_pradesh', 'Andhra Pradesh'),
    ('assam', 'Assam'),
    ('himachal_pradesh', 'Himachal Pradesh'),
    ('goa', 'Goa'),
    ('chhattisgarh', 'Chhattisgarh'),
    ('jharkhand', 'Jharkhand'),
]

FESTIVAL_TAGS = [
    ('diwali', 'Diwali'),
    ('holi', 'Holi'),
    ('pongal', 'Pongal'),
    ('eid', 'Eid'),
    ('navratri', 'Navratri'),
    ('ganesh_chaturthi', 'Ganesh Chaturthi'),
    ('makar_sankranti', 'Makar Sankranti'),
    ('baisakhi', 'Baisakhi'),
    ('onam', 'Onam'),
    ('durga_puja', 'Durga Puja'),
    ('none', 'Not Festival Specific'),
]


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=10, blank=True)

    class Meta:
        db_table = 'food_categories'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class FoodItem(models.Model):
    FOOD_TYPE = [('veg', 'Vegetarian'), ('non_veg', 'Non-Vegetarian'), ('vegan', 'Vegan')]

    vendor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_items')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='foods')

    # Basic info
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    food_type = models.CharField(max_length=10, choices=FOOD_TYPE, default='veg')
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    # Regional identity
    region = models.CharField(max_length=50, choices=INDIAN_REGIONS)
    village_or_city = models.CharField(max_length=100, blank=True)

    # Cultural storytelling (USP)
    cultural_story = models.TextField(help_text='The heritage story behind this dish')
    cooking_method = models.TextField(help_text='Traditional cooking method description')
    ingredients = models.TextField(help_text='List of ingredients, comma separated')
    did_you_know = models.TextField(blank=True, help_text='Interesting fact about this dish')
    grandma_note = models.TextField(blank=True, help_text='A personal touch / grandma tip')

    # Festival association
    festival_tag = models.CharField(max_length=30, choices=FESTIVAL_TAGS, default='none')

    # Meta
    prep_time_minutes = models.IntegerField(default=30)
    serves = models.IntegerField(default=2)
    calories = models.IntegerField(null=True, blank=True)
    tags = models.CharField(max_length=500, blank=True)

    # Stats
    total_orders = models.IntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    review_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'food_items'
        ordering = ['-is_featured', '-total_orders']

    def __str__(self):
        return f'{self.name} — {self.get_region_display()}'

    @property
    def effective_price(self):
        return self.discounted_price if self.discounted_price else self.price


class FoodImage(models.Model):
    food = models.ForeignKey(FoodItem, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='foods/')
    caption = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)

    class Meta:
        db_table = 'food_images'

    def __str__(self):
        return f'Image for {self.food.name}'