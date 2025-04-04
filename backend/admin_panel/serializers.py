# admin_panel/serializers.py
from rest_framework import serializers
from .models import Owner, Salao
from admin_panel.models import Pagamento
from django.contrib.auth.models import User


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

        # Remover caracteres não numéricos (ex: ".", "/", "-")
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


class PagamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pagamento
        fields = "__all__"
