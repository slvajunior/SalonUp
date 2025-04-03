# backend/clientes/models.py

from django.db import models
from django.utils import timezone


class Cliente(models.Model):
    nome = models.CharField(max_length=100)
    telefone = models.CharField(max_length=15, null=False, default="00000000000000")
    email = models.EmailField()
    data_cadastro = models.DateTimeField(default=timezone.now)
    salao = models.ForeignKey("admin_panel.Salao", on_delete=models.CASCADE, default=1)

    def __str__(self):
        return self.nome
