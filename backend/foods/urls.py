from django.urls import path
from .views import (
    FoodItemListView, FoodItemDetailView, CategoryListView,
    FestivalFoodsView, RegionalFoodsView, FeaturedFoodsView
)

urlpatterns = [
    path('', FoodItemListView.as_view(), name='food-list'),
    path('featured/', FeaturedFoodsView.as_view(), name='food-featured'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('festival/<str:festival>/', FestivalFoodsView.as_view(), name='festival-foods'),
    path('region/<str:region>/', RegionalFoodsView.as_view(), name='regional-foods'),
    path('<slug:slug>/', FoodItemDetailView.as_view(), name='food-detail'),
]