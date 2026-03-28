from django.db import models
from users.models import User


class Story(models.Model):
    STORY_TYPE = [
        ('food_story', 'Food Story'),
        ('grandma_recipe', 'Grandma Recipe'),
        ('village_special', 'Village Special'),
        ('festival_story', 'Festival Story'),
        ('chef_story', 'Chef Story'),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stories')
    title = models.CharField(max_length=300)
    slug = models.SlugField(unique=True)
    story_type = models.CharField(max_length=20, choices=STORY_TYPE, default='food_story')
    content = models.TextField()
    excerpt = models.CharField(max_length=500)
    cover_image = models.ImageField(upload_to='stories/', null=True, blank=True)
    video_url = models.URLField(blank=True)
    region = models.CharField(max_length=50, blank=True)
    tags = models.CharField(max_length=300, blank=True)
    is_published = models.BooleanField(default=True)
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'stories'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class StorySerializer:
    pass