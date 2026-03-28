from django.urls import path
from .views import ReviewListCreateView

urlpatterns = [
    path('<slug:food_slug>/', ReviewListCreateView.as_view(), name='review-list'),
]