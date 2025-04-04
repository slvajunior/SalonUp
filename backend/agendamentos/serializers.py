# backend/agendamentos/serializers.py

from rest_framework import serializers
from .models import Agendamento


class AgendamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agendamento
        fields = [
            "id",
            "data_hora",
            "servico",
            "cliente",
            "salao",
            "status",
        ]
        read_only_fields = ["id", "salao", "status"]
        extra_kwargs = {
            "data_hora": {"required": True},
            "servico": {"required": True},
            "cliente": {"required": True},
        }
        # Adiciona validações adicionais, se necessário
        # def validate_servico(self, value):
