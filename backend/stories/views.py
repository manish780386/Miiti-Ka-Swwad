from rest_framework import generics, permissions
from .models import Story
from .serializers import StorySerializer


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