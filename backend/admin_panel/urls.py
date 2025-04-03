# backend/admin_panel/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OwnerViewSet, SalaoViewSet
from rest_framework_simplejwt.views import TokenRefreshView
from .views import AdminLoginView
from .views import DashboardView

router = DefaultRouter()
router.register(r'owners', OwnerViewSet)
router.register(r'saloes', SalaoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('login/', AdminLoginView.as_view(), name='admin-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('dashboard/', DashboardView.as_view(), name='dashboard-api'),
    path('admin-panel/dashboard/', DashboardView.as_view(), name='dashboard'),
]
