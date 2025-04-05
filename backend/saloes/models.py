from django.conf import settings
from django.db import models
from django.utils import timezone


class Salao(models.Model):
    STATUS_CHOICES = [
        ("ativo", "Ativo"),
        ("inativo", "Inativo"),
        ("suspenso", "Suspenso")
    ]

    nome = models.CharField(max_length=100)
    cnpj = models.CharField(max_length=18, unique=True, blank=True, null=True)
    endereco = models.TextField()
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=2)
    telefone = models.CharField(max_length=15)
    email = models.EmailField()
    data_cadastro = models.DateTimeField(default=timezone.now)

    status = models.CharField(
        max_length=20,  # Aumentado de 7 para 10 para garantir espaço
        choices=STATUS_CHOICES,
        default='ativo'
    )

    proprietario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saloes"
    )

    clientes = models.ManyToManyField("clientes.Cliente", related_name="saloes_cliente")

    def __str__(self):
        return self.nome
