from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
    Group,
    Permission,
)
from django.db import models


class OwnerManager(BaseUserManager):
    def create_owner(self, email, name, password=None):
        if not email:
            raise ValueError("O proprietário deve ter um e-mail")
        email = self.normalize_email(email)
        owner = self.model(email=email, name=name)
        owner.set_password(password)
        owner.save(using=self._db)
        return owner


class Owner(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    groups = models.ManyToManyField(Group, related_name="owner_set", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="owner_set", blank=True)

    objects = OwnerManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.name


class Salao(models.Model):
    nome = models.CharField(max_length=255)
    proprietario = models.ForeignKey(Owner, on_delete=models.CASCADE)  # Alteração aqui
    cnpj = models.CharField(max_length=18, unique=True, blank=True, null=True)
    endereco = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=10,
        choices=[("ativo", "Ativo"), ("inativo", "Inativo")],
        default="ativo",
    )
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} ({self.proprietario.name})"  # Alteração para exibir o nome do Owner
