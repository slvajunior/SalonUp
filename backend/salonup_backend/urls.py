# salonup_backend/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from agendamentos.views import AgendamentoViewSet
from clientes.views import ClienteViewSet
from rest_framework_simplejwt import views as jwt_views
from admin_panel.views import SalaoViewSet


# Criamos um router para registrar os endpoints automaticamente
router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'agendamentos', AgendamentoViewSet)
router.register(r'saloes', SalaoViewSet, basename='salao')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('admin-panel/', include('admin_panel.urls')),
    path('api/', include(router.urls)),  # Inclui as rotas da API
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]
