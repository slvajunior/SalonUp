# apps/agendamentos/models.py

from django.db import models
from clientes.models import Cliente


class Agendamento(models.Model):
    cliente = models.ForeignKey(
        Cliente, on_delete=models.CASCADE, related_name="agendamentos"
    )
    data_hora = models.DateTimeField()
    servico = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=[("pendente", "Pendente"), ("concluido", "Concluído")],
        default="pendente",
    )
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.servico} - {self.data_hora}"
