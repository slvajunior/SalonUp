# apps/agendamentos/models.py

from django.db import models
from clientes.models import Cliente, Salao


class Agendamento(models.Model):
    salao = models.ForeignKey(Salao, on_delete=models.CASCADE)  # Obrigatório após migração
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    data_hora = models.DateTimeField()
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=(
        ('agendado', 'Agendado'),
        ('finalizado', 'Finalizado'),
        ('cancelado', 'Cancelado'),
    ), default='agendado')

    def __str__(self):
        return f"Agendamento #{self.id} - {self.cliente.nome}"
