from django.core.exceptions import ValidationError
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    # PermissionsMixin,
    # Group,
    # Permission,
)

from django.db import models


class OwnerManager(BaseUserManager):
    use_in_migrations = True  # 🔥 Isso ajuda o Django a reconhecer o Manager!

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
        user.save(using=self._db)
        return user


class Owner(AbstractBaseUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_master = models.BooleanField(default=False)

    objects = OwnerManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if self.is_master:
            # Se o usuário já existe (tem um `id` no banco), ignora a verificação
            if not self.pk and Owner.objects.filter(is_master=True).exists():
                raise ValidationError(
                    "Já existe um superusuário. Apenas um é permitido."
                )
        super().save(*args, **kwargs)


class Salao(models.Model):
    nome = models.CharField(max_length=255)
    proprietario = models.ForeignKey(Owner, on_delete=models.CASCADE, null=True, blank=True)  # Allowing null and blank
    cnpj = models.CharField(max_length=18, unique=True, blank=True, null=True)
    endereco = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=10,
        choices=[("ativo", "Ativo"), ("inativo", "Inativo")],
        default="ativo",
    )
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} ({self.proprietario.name if self.proprietario else 'Sem Proprietário'})"
