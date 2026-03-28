from django.urls import path
from .views import (
    VendorProfileView,
    VendorFoodListView, VendorFoodCreateView, VendorFoodDetailView, VendorToggleFoodView,
    VendorOrdersView, VendorUpdateOrderStatusView,
    VendorDashboardView,
)

urlpatterns = [
    path("profile/",                      VendorProfileView.as_view(),            name="vendor-profile"),
    path("foods/",                        VendorFoodListView.as_view(),            name="vendor-foods"),
    path("foods/add/",                    VendorFoodCreateView.as_view(),          name="vendor-food-add"),
    path("foods/<int:pk>/",               VendorFoodDetailView.as_view(),          name="vendor-food-detail"),
    path("foods/<int:pk>/toggle/",        VendorToggleFoodView.as_view(),          name="vendor-food-toggle"),
    path("orders/",                       VendorOrdersView.as_view(),              name="vendor-orders"),
    path("orders/<int:order_id>/status/", VendorUpdateOrderStatusView.as_view(),   name="vendor-order-status"),
    path("dashboard/",                    VendorDashboardView.as_view(),           name="vendor-dashboard"),
]