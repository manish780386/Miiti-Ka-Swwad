from rest_framework import generics, permissions, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as df_filters
from .models import FoodItem, Category
from .serializers import (
    FoodItemListSerializer, FoodItemDetailSerializer,
    FoodItemCreateSerializer, CategorySerializer
)


class FoodItemFilter(df_filters.FilterSet):
    min_price = df_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = df_filters.NumberFilter(field_name='price', lookup_expr='lte')
    region = df_filters.CharFilter(field_name='region', lookup_expr='exact')
    food_type = df_filters.CharFilter(field_name='food_type', lookup_expr='exact')
    festival_tag = df_filters.CharFilter(field_name='festival_tag', lookup_expr='exact')
    category = df_filters.NumberFilter(field_name='category__id')
    is_featured = df_filters.BooleanFilter(field_name='is_featured')

    class Meta:
        model = FoodItem
        fields = ['region', 'food_type', 'festival_tag', 'category', 'is_featured']


class FoodItemListView(generics.ListAPIView):
    serializer_class = FoodItemListSerializer
    permission_classes = [permissions.AllowAny]
    filterset_class = FoodItemFilter
    search_fields = ['name', 'description', 'cultural_story', 'tags', 'village_or_city']
    ordering_fields = ['price', 'average_rating', 'total_orders', 'created_at']
    ordering = ['-is_featured', '-total_orders']

    def get_queryset(self):
        return FoodItem.objects.filter(is_available=True).prefetch_related('images').select_related('vendor', 'category')


class FoodItemDetailView(generics.RetrieveAPIView):
    serializer_class = FoodItemDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return FoodItem.objects.filter(is_available=True).prefetch_related('images').select_related('vendor', 'category')


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    queryset = Category.objects.all()


class FestivalFoodsView(generics.ListAPIView):
    """Festival-based food highlights"""
    serializer_class = FoodItemListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        festival = self.kwargs.get('festival')
        return FoodItem.objects.filter(
            festival_tag=festival, is_available=True
        ).prefetch_related('images').select_related('vendor')


class RegionalFoodsView(generics.ListAPIView):
    """Region-based browsing"""
    serializer_class = FoodItemListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        region = self.kwargs.get('region')
        return FoodItem.objects.filter(
            region=region, is_available=True
        ).prefetch_related('images').select_related('vendor')


class FeaturedFoodsView(generics.ListAPIView):
    serializer_class = FoodItemListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return FoodItem.objects.filter(
            is_featured=True, is_available=True
        ).prefetch_related('images').select_related('vendor')[:12]