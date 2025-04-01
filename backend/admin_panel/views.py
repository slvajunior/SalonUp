# backend/admin_panel/views.py
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework import viewsets
from .models import Owner, Salao
from .serializers import OwnerSerializer, SalaoSerializer
from rest_framework.permissions import IsAuthenticated
from clientes.models import Cliente
from agendamentos.models import Agendamento
from django.http import JsonResponse
import logging
from django.db.models import Sum


logger = logging.getLogger(__name__)
User = get_user_model()


class IsAdminUser(BasePermission):
    """Permissão para restringir acesso apenas a administradores."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin


class AdminLoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        try:
            user = User.objects.get(username=request.data.get("username"))
        except User.DoesNotExist:
            return Response(
                {"error": "Usuário não encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Verifique se o usuário é admin com o campo is_admin
        if not user.is_admin:
            return Response(
                {"error": "Acesso negado. Apenas administradores podem entrar."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Armazena tokens em HttpOnly cookies
        res = Response(
            {"message": "Login realizado com sucesso!"}, status=status.HTTP_200_OK
        )
        res.set_cookie(
            "access_token",
            response.data["access"],
            httponly=True,
            secure=True,
            samesite="Strict",
        )
        res.set_cookie(
            "refresh_token",
            response.data["refresh"],
            httponly=True,
            secure=True,
            samesite="Strict",
        )
        return res


class AdminLogoutView(permissions.IsAuthenticated):
    """View para realizar logout e invalidar o token."""

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            response = JsonResponse({"message": "Logout realizado com sucesso!"})
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            return response
        except Exception as e:
            logger.error(f"Erro ao fazer logout: {e}")
            return Response(
                {"error": "Erro ao fazer logout."}, status=status.HTTP_400_BAD_REQUEST
            )


class ProtectedAdminView(APIView):
    """Exemplo de endpoint protegido para admins."""

    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response(
            {"message": "Bem-vindo ao painel administrativo!"},
            status=status.HTTP_200_OK,
        )


class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer
    permission_classes = [
        IsAuthenticated
    ]  # Garantir que apenas usuários autenticados possam acessar


class SalaoViewSet(viewsets.ModelViewSet):
    queryset = Salao.objects.all()
    serializer_class = SalaoSerializer
    permission_classes = [IsAuthenticated]


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Contagem de salões (modelo separado Salao)
        total_saloes = Salao.objects.count()

        # Contagem de clientes (modelo Cliente)
        total_clientes = Cliente.objects.count()

        # Faturamento mensal (considerando agendamentos finalizados)
        faturamento_mensal = (
            Agendamento.objects.filter(status="finalizado").aggregate(
                total=Sum("valor")
            )["total"]
            or 0.0
        )

        data = {
            "total_saloes": total_saloes,
            "total_clientes": total_clientes,
            "faturamento_mensal": float(
                faturamento_mensal
            ),  # Convertendo para float seguro
        }

        return Response(data, status=status.HTTP_200_OK)
