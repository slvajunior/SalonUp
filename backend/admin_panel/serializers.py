from rest_framework import serializers
from .models import Owner, Salao


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = ['id', 'name', 'email', 'is_active', 'date_joined', 'last_updated']


class SalaoSerializer(serializers.ModelSerializer):
    proprietario = OwnerSerializer(read_only=True)  # Exibindo as informações do proprietário no salão

    class Meta:
        model = Salao
        fields = ['id', 'nome', 'proprietario', 'cnpj', 'endereco', 'status', 'data_cadastro']
