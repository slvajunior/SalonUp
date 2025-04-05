# admin_panel/serializers.py
from rest_framework import serializers
from .models import Owner
from admin_panel.models import Pagamento
from django.contrib.auth.models import User
from saloes.models import Salao


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = ["id", "name", "email", "is_active", "date_joined", "last_updated"]


class SalaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salao
        fields = [
            "id",
            "nome",
            "cnpj",
            "endereco",
            "cidade",
            "estado",
            "telefone",
            "email",
            "status",
            "data_cadastro",
        ]

    def validate_cnpj(self, value):
        """Validação do CNPJ para garantir que ele seja preenchido e tenha um formato válido."""
        if not value:
            raise serializers.ValidationError("O CNPJ é obrigatório.")

        import re

        cnpj_numerico = re.sub(r"\D", "", value)

        if len(cnpj_numerico) != 14:
            raise serializers.ValidationError(
                "CNPJ inválido. Deve conter 14 dígitos numéricos."
            )

        return value

    def create(self, validated_data):
        """Adiciona o proprietário automaticamente antes de criar o salão."""
        request = self.context.get("request")

        if not request or not request.user or not request.user.is_authenticated:
            raise serializers.ValidationError(
                {"detail": "Ação não permitida. Faça login para criar um salão."}
            )

        validated_data["proprietario"] = request.user  # Captura automaticamente o dono
        return super().create(validated_data)


class RevenueChartSerializer(serializers.Serializer):
    labels = serializers.ListField(child=serializers.CharField())
    data = serializers.ListField(child=serializers.FloatField())  # valores monetários


class RegionDataSerializer(serializers.Serializer):
    labels = serializers.ListField(child=serializers.CharField())
    data = serializers.ListField(
        child=serializers.IntegerField()
    )  # número de salões por região


class RecentSalaoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nome = serializers.CharField()
    cidade = serializers.CharField()
    status = serializers.CharField()
    data_cadastro = serializers.DateField(format="%Y-%m-%d")


class RecentActivitySerializer(serializers.Serializer):
    icon = serializers.CharField()
    message = serializers.CharField()
    time = serializers.CharField()  # exemplo: "2 horas atrás"


class DashboardSerializer(serializers.Serializer):
    total_saloes = serializers.IntegerField()
    saloes_growth = serializers.FloatField()
    total_clientes = serializers.IntegerField()
    clientes_growth = serializers.FloatField()
    faturamento_mensal = serializers.FloatField()
    revenue_growth = serializers.FloatField()
    total_agendamentos = serializers.IntegerField()
    agendamentos_change = serializers.FloatField()

    revenue_chart = RevenueChartSerializer()
    salons_by_region = RegionDataSerializer()

    recent_saloes = RecentSalaoSerializer(many=True)
    recent_activities = RecentActivitySerializer(many=True)


class PagamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pagamento
        fields = "__all__"
