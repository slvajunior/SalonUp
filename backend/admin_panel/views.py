# admin_panel/views.py
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
from .serializers import OwnerSerializer, SalaoSerializer
from clientes.models import Cliente
from agendamentos.models import Agendamento
from django.http import JsonResponse

import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta
from .models import Owner, Salao, Pagamento
from django.core.exceptions import ValidationError
from dateutil.relativedelta import relativedelta


logger = logging.getLogger(__name__)
User = get_user_model()


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        time_range = request.query_params.get("range", "month")

        try:
            # Dados básicos
            total_saloes = Salao.objects.count()
            total_clientes = Cliente.objects.count()
            total_agendamentos = Agendamento.objects.count()

            # Cálculos de crescimento
            saloes_growth = self.calculate_saloes_growth(time_range)
            clientes_growth = self.calculate_clientes_growth(time_range)

            # Faturamento
            faturamento_result = self.calculate_faturamento(time_range)
            faturamento_mensal = faturamento_result["current"]
            revenue_growth = faturamento_result["growth"]

            # Dados para gráficos e listas
            revenue_data = self.get_revenue_chart_data(time_range)
            salons_by_region = self.get_salons_by_region()
            recent_saloes_data = self.get_recent_saloes()
            recent_activities = self.get_recent_activities()

            data = {
                "total_saloes": total_saloes,
                "saloes_growth": saloes_growth,
                "total_clientes": total_clientes,
                "clientes_growth": clientes_growth,
                "faturamento_mensal": faturamento_mensal,
                "revenue_growth": revenue_growth,
                "total_agendamentos": total_agendamentos,
                "agendamentos_change": self.calculate_agendamentos_change(time_range),
                "revenue_chart": revenue_data,
                "salons_by_region": salons_by_region,
                "recent_saloes": recent_saloes_data,
                "recent_activities": recent_activities,
            }

            return Response(data)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def calculate_saloes_growth(self, time_range):
        """Calcula o crescimento percentual de salões no período"""
        current_count = Salao.objects.count()

        if time_range == "week":
            start_date = timezone.now() - timedelta(days=7)
        elif time_range == "year":
            start_date = timezone.now() - timedelta(days=365)
        else:  # month
            start_date = timezone.now() - timedelta(days=30)

        previous_count = Salao.objects.filter(data_cadastro__lt=start_date).count()

        return self._calculate_growth(current_count, previous_count)

    def calculate_clientes_growth(self, time_range):
        """Calcula o crescimento percentual de clientes no período"""
        current_count = Cliente.objects.count()

        if time_range == "week":
            start_date = timezone.now() - timedelta(days=7)
        elif time_range == "year":
            start_date = timezone.now() - timedelta(days=365)
        else:  # month
            start_date = timezone.now() - timedelta(days=30)

        previous_count = Cliente.objects.filter(data_cadastro__lt=start_date).count()

        return self._calculate_growth(current_count, previous_count)

    def calculate_faturamento(self, time_range):
        """Calcula o faturamento e crescimento no período"""
        if time_range == "week":
            current_start = timezone.now() - timedelta(days=7)
            previous_start = timezone.now() - timedelta(days=14)
            previous_end = timezone.now() - timedelta(days=7)
        elif time_range == "year":
            current_start = timezone.now() - timedelta(days=365)
            previous_start = timezone.now() - timedelta(days=730)
            previous_end = timezone.now() - timedelta(days=365)
        else:  # month
            current_start = timezone.now() - timedelta(days=30)
            previous_start = timezone.now() - timedelta(days=60)
            previous_end = timezone.now() - timedelta(days=30)

        current_faturamento = (
            Pagamento.objects.filter(data_pagamento__gte=current_start).aggregate(
                total=Sum("valor")
            )["total"]
            or 0
        )

        previous_faturamento = (
            Pagamento.objects.filter(
                data_pagamento__gte=previous_start, data_pagamento__lt=previous_end
            ).aggregate(total=Sum("valor"))["total"]
            or 0
        )

        growth = self._calculate_growth(current_faturamento, previous_faturamento)

        return {"current": float(current_faturamento), "growth": growth}

    def calculate_agendamentos_change(self, time_range):
        """Calcula a variação de agendamentos no período"""
        if time_range == "week":
            current_start = timezone.now() - timedelta(days=7)
            previous_start = timezone.now() - timedelta(days=14)
            previous_end = timezone.now() - timedelta(days=7)
        elif time_range == "year":
            current_start = timezone.now() - timedelta(days=365)
            previous_start = timezone.now() - timedelta(days=730)
            previous_end = timezone.now() - timedelta(days=365)
        else:  # month
            current_start = timezone.now() - timedelta(days=30)
            previous_start = timezone.now() - timedelta(days=60)
            previous_end = timezone.now() - timedelta(days=30)

        current_count = Agendamento.objects.filter(data_hora__gte=current_start).count()

        previous_count = Agendamento.objects.filter(
            data_hora__gte=previous_start, data_hora__lt=previous_end
        ).count()

        return self._calculate_growth(current_count, previous_count)

    def get_revenue_chart_data(self, time_range):
        """Gera dados para o gráfico de faturamento"""
        today = timezone.now().date()

        if time_range == "week":
            # Consulta os últimos 7 dias
            labels = []
            data = []
            for i in range(6, -1, -1):
                date = today - timedelta(days=i)
                labels.append(date.strftime("%a"))
                total = (
                    Pagamento.objects.filter(data_pagamento__date=date).aggregate(
                        total=Sum("valor")
                    )["total"]
                    or 0
                )
                data.append(float(total))

        elif time_range == "year":
            # Consulta os últimos 12 meses
            labels = []
            data = []
            for i in range(11, -1, -1):
                # month_start = today.replace(day=1) - timedelta(days=30 * i)
                month_start = (today.replace(day=1) - relativedelta(months=i))

                month_end = (month_start + timedelta(days=32)).replace(day=1)
                labels.append(month_start.strftime("%b"))
                total = (
                    Pagamento.objects.filter(
                        data_pagamento__gte=month_start, data_pagamento__lt=month_end
                    ).aggregate(total=Sum("valor"))["total"]
                    or 0
                )
                data.append(float(total))

        else:  # month (padrão)
            # Consulta as últimas 4 semanas
            labels = []
            data = []
            for i in range(3, -1, -1):
                week_start = today - timedelta(days=(i + 1) * 7)
                week_end = week_start + timedelta(days=7)
                labels.append(f"Sem {i+1}")
                total = (
                    Pagamento.objects.filter(
                        data_pagamento__gte=week_start, data_pagamento__lt=week_end
                    ).aggregate(total=Sum("valor"))["total"]
                    or 0
                )
                data.append(float(total))

        return {"labels": labels, "data": data}

    def get_salons_by_region(self):
        """Agrupa salões por região"""
        regions = (
            Salao.objects.values("estado")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        labels = [r["estado"] for r in regions]
        data = [r["count"] for r in regions]

        return {"labels": labels, "data": data}

    def get_recent_saloes(self):
        """Obtém os últimos salões cadastrados"""
        recent_saloes = Salao.objects.order_by("-data_cadastro")[:5]

        return [
            {
                "id": salao.id,
                "nome": salao.nome,
                "cidade": salao.cidade,
                "status": salao.status,
                "data_cadastro": salao.data_cadastro.strftime("%Y-%m-%d"),
            }
            for salao in recent_saloes
        ]

    def get_recent_activities(self):
        """Obtém as atividades recentes do sistema"""
        # Exemplo - implemente conforme sua lógica de negócio
        return [
            {
                "icon": "store",
                "message": "Novo salão cadastrado: Belle Hair",
                "time": "2 horas atrás",
            },
            {
                "icon": "dollar-sign",
                "message": "Pagamento recebido de Salão Elegance",
                "time": "1 dia atrás",
            },
        ]

    def _calculate_growth(self, current, previous):
        """Método auxiliar para calcular crescimento percentual"""
        if previous == 0:
            return 100 if current > 0 else 0
        return round(((current - previous) / previous) * 100, 2)


class IsAdminUser(BasePermission):
    """Permissão para restringir acesso apenas a administradores."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin


class IsMasterUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_master


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
    ]


class SalaoViewSet(viewsets.ModelViewSet):
    queryset = Salao.objects.all()
    serializer_class = SalaoSerializer
    permission_classes = [IsMasterUser]  # 🔥 Apenas o is_master pode acessar

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Salao.objects.none()

        if user.is_master:
            return Salao.objects.all()  # 🔥 O admin vê todos os salões

        return Salao.objects.filter(proprietario=user)  # 🔥 Proprietário vê só o dele

    def perform_create(self, serializer):
        """Garante que apenas o usuário master possa criar salões"""
        user = self.request.user

        if not user.is_authenticated:
            raise ValidationError({"detail": "Usuário não autenticado."})

        if not user.is_master:
            raise ValidationError({"detail": "Apenas o usuário master pode criar salões."})  # 🔥 Correção

        serializer.save(proprietario=user)  # 🔥 Agora o master pode criar salões
