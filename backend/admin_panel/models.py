# admin_panel/models.py
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from django.db import models
from agendamentos.models import Agendamento
from clientes.models import Cliente
from saloes.models import Salao


cli_ = Cliente.objects.all()


class OwnerManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, username, email, password=None):
        if not username:
            raise ValueError("O campo username é obrigatório")
        if not email:
            raise ValueError("O campo email é obrigatório")

        user = self.model(username=username, email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password):
        user = self.create_user(username, email, password)
        user.is_admin = True
        user.is_master = True
        user.is_superuser = True  # Garante compatibilidade com o Django Admin
        user.save(using=self._db)
        return user


class Owner(AbstractBaseUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_master = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)  # Django Admin compatível

    objects = OwnerManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username

    def clean(self):
        """Garante que só exista um `is_master=True` no banco"""
        if self.is_master and Owner.objects.filter(is_master=True).exclude(pk=self.pk).exists():
            raise ValidationError("Já existe um superusuário. Apenas um é permitido.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class Pagamento(models.Model):
    METODO_PAGAMENTO_CHOICES = [
        ("pix", "PIX"),
        ("cartao", "Cartão de Crédito/Débito"),
        ("dinheiro", "Dinheiro"),
        ("boleto", "Boleto"),
    ]

    agendamento = models.ForeignKey(Agendamento, on_delete=models.CASCADE)
    salao = models.ForeignKey(Salao, on_delete=models.CASCADE)  # Relacionamento direto com Salao
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    metodo = models.CharField(max_length=50, choices=METODO_PAGAMENTO_CHOICES)
    data_pagamento = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Pagamento #{self.id}"


class Servico(models.Model):
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    valor_padrao = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.nome
