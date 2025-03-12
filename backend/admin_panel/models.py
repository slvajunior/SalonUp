from django.db import models
from clientes.models import Cliente  # Importando o modelo de proprietários


class Salao(models.Model):
    nome = models.CharField(max_length=255)
    proprietario = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    cnpj = models.CharField(max_length=18, unique=True, blank=True, null=True)
    endereco = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=[('ativo', 'Ativo'), ('inativo', 'Inativo')], default='ativo')
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} ({self.proprietario.nome})"
