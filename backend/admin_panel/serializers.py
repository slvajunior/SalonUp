from rest_framework import serializers
from .models import Owner, Salao


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = ['id', 'name', 'email', 'is_active', 'date_joined', 'last_updated']


class SalaoSerializer(serializers.ModelSerializer):
    proprietario = OwnerSerializer(read_only=True, required=False)  # Não obrigatório ao criar, pode ser null

    class Meta:
        model = Salao
        fields = ['id', 'nome', 'proprietario', 'cnpj', 'endereco', 'status', 'data_cadastro']

    def create(self, validated_data):
        # Se não houver proprietario nos dados, o salao será criado com 'proprietario' como None
        proprietario = validated_data.get('proprietario', None)
        salao = Salao.objects.create(proprietario=proprietario, **validated_data)
        return salao
