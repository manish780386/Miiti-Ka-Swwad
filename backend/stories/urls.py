from django.urls import path
from .views import StoryListView, StoryDetailView, StoryCreateView

urlpatterns = [
    path('', StoryListView.as_view(), name='story-list'),
    path('create/', StoryCreateView.as_view(), name='story-create'),
    path('<slug:slug>/', StoryDetailView.as_view(), name='story-detail'),
]