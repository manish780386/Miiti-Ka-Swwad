from django.db.models import Sum, Avg, Count, F
from rest_framework import generics, permissions, serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from foods.models import FoodItem
from foods.serializers import FoodItemListSerializer, FoodItemCreateSerializer
from orders.models import Order, OrderItem
from .models import VendorProfile


class IsVendor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "vendor"


# ── Vendor Profile ────────────────────────────────────────────────────────────
class VendorProfileSerializer(serializers.ModelSerializer):
    owner_name  = serializers.CharField(source="user.full_name", read_only=True)
    owner_email = serializers.CharField(source="user.email",     read_only=True)

    class Meta:
        model  = VendorProfile
        fields = "__all__"
        read_only_fields = ["user", "is_verified", "rating", "total_orders"]


class VendorProfileView(generics.RetrieveUpdateAPIView):
    serializer_class   = VendorProfileSerializer
    permission_classes = [IsVendor]

    def get_object(self):
        profile, _ = VendorProfile.objects.get_or_create(user=self.request.user)
        return profile


# ── Food CRUD ─────────────────────────────────────────────────────────────────
class VendorFoodListView(generics.ListAPIView):
    serializer_class   = FoodItemListSerializer
    permission_classes = [IsVendor]

    def get_queryset(self):
        return FoodItem.objects.filter(vendor=self.request.user).prefetch_related("images")


class VendorFoodCreateView(generics.CreateAPIView):
    serializer_class   = FoodItemCreateSerializer
    permission_classes = [IsVendor]

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)


class VendorFoodDetailView(APIView):
    """GET / PATCH / DELETE a single vendor food item."""
    permission_classes = [IsVendor]

    def _get_food(self, pk, user):
        return get_object_or_404(FoodItem, pk=pk, vendor=user)

    def get(self, request, pk):
        from apps.foods.serializers import FoodItemDetailSerializer
        food = self._get_food(pk, request.user)
        return Response(FoodItemDetailSerializer(food, context={"request": request}).data)

    def patch(self, request, pk):
        food = self._get_food(pk, request.user)
        serializer = FoodItemCreateSerializer(
            food, data=request.data, partial=True,
            context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        # Return detailed errors so frontend knows exactly what failed
        return Response(
            {"errors": serializer.errors, "detail": str(serializer.errors)},
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        food = self._get_food(pk, request.user)
        food.delete()
        return Response({"message": "Dish deleted."}, status=status.HTTP_204_NO_CONTENT)


class VendorToggleFoodView(APIView):
    """Toggle is_available or is_featured on a food item."""
    permission_classes = [IsVendor]

    def patch(self, request, pk):
        food  = get_object_or_404(FoodItem, pk=pk, vendor=request.user)
        field = request.data.get("field")
        if field not in ("is_available", "is_featured"):
            return Response({"error": "field must be is_available or is_featured"}, status=400)
        setattr(food, field, not getattr(food, field))
        food.save(update_fields=[field])
        return Response({field: getattr(food, field)})


# ── Orders ────────────────────────────────────────────────────────────────────
class VendorOrdersView(APIView):
    permission_classes = [IsVendor]

    def get(self, request):
        vendor_items = (
            OrderItem.objects
            .filter(vendor=request.user)
            .select_related("order", "food_item", "order__user")
            .order_by("-order__created_at")
        )
        seen, result = set(), []
        for item in vendor_items:
            oid = item.order.id
            if oid not in seen:
                seen.add(oid)
                result.append({
                    "order_id":       oid,
                    "customer":       item.order.user.full_name if item.order.user else "Unknown",
                    "status":         item.order.status,
                    "payment_status": item.order.payment_status,
                    "total_amount":   float(item.order.total_amount),
                    "created_at":     item.order.created_at,
                    "items": [
                        {"name": oi.food_name, "qty": oi.quantity, "price": float(oi.food_price)}
                        for oi in item.order.items.filter(vendor=request.user)
                    ],
                })
        return Response(result)


class VendorUpdateOrderStatusView(APIView):
    permission_classes = [IsVendor]

    def patch(self, request, order_id):
        ALLOWED = ["confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"]
        new_status = request.data.get("status")
        if new_status not in ALLOWED:
            return Response({"error": f"Status must be one of {ALLOWED}"}, status=400)
        has_items = OrderItem.objects.filter(order_id=order_id, vendor=request.user).exists()
        if not has_items:
            return Response({"error": "Order not found for this vendor"}, status=404)
        order = get_object_or_404(Order, id=order_id)
        order.status = new_status
        order.save(update_fields=["status"])
        return Response({"status": new_status})


# ── Dashboard ─────────────────────────────────────────────────────────────────
class VendorDashboardView(APIView):
    permission_classes = [IsVendor]

    def get(self, request):
        vendor      = request.user
        foods       = FoodItem.objects.filter(vendor=vendor)
        order_items = OrderItem.objects.filter(vendor=vendor, order__payment_status="paid")

        total_revenue = order_items.aggregate(
            total=Sum(F("food_price") * F("quantity"))
        )["total"] or 0

        return Response({
            "total_dishes":    foods.count(),
            "active_dishes":   foods.filter(is_available=True).count(),
            "featured_dishes": foods.filter(is_featured=True).count(),
            "total_orders":    order_items.values("order").distinct().count(),
            "total_revenue":   float(total_revenue),
            "avg_rating":      float(foods.aggregate(avg=Avg("average_rating"))["avg"] or 0),
            "top_dishes": FoodItemListSerializer(
                foods.order_by("-total_orders")[:5],
                many=True,
                context={"request": request},
            ).data,
        })