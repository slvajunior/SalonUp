# backend/agendamentos/models.py

from django.db import models


class Agendamento(models.Model):
    cliente = models.ForeignKey('clientes.Cliente', on_delete=models.CASCADE)
    servico = models.ForeignKey("admin_panel.Servico", on_delete=models.CASCADE)
    data_hora = models.DateTimeField()
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='agendado')
    salao = models.ForeignKey('saloes.Salao', on_delete=models.CASCADE)
