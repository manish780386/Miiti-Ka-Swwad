from rest_framework import serializers, generics, permissions
from .models import Story


class StorySerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.full_name', read_only=True)
    author_image = serializers.SerializerMethodField()
    story_type_display = serializers.CharField(source='get_story_type_display', read_only=True)

    class Meta:
        model = Story
        fields = [
            'id', 'title', 'slug', 'story_type', 'story_type_display',
            'content', 'excerpt', 'cover_image', 'video_url',
            'region', 'tags', 'views', 'author_name', 'author_image', 'created_at'
        ]
        read_only_fields = ['author', 'views']

    def get_author_image(self, obj):
        if obj.author.profile_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.author.profile_image.url) if request else None
        return None


class StoryListView(generics.ListAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.AllowAny]
    search_fields = ['title', 'content', 'tags', 'region']

    def get_queryset(self):
        qs = Story.objects.filter(is_published=True).select_related('author')
        story_type = self.request.query_params.get('type')
        if story_type:
            qs = qs.filter(story_type=story_type)
        return qs


class StoryDetailView(generics.RetrieveAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Story.objects.filter(is_published=True)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save(update_fields=['views'])
        return super().retrieve(request, *args, **kwargs)


class StoryCreateView(generics.CreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)