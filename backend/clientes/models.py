# apps/clientes/models.py
from django.db import models
from django.contrib.auth.models import User


class Cliente(models.Model):
    nome = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    telefone = models.CharField(max_length=15, blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    is_salao = models.BooleanField(default=False)

    def __str__(self):
        return self.nome


class Salao(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    nome = models.CharField(max_length=100)
    cnpj = models.CharField(max_length=18, unique=True)
    endereco = models.TextField()
    status = models.CharField(max_length=10, default='ativo')
    # outros campos específicos de salão
