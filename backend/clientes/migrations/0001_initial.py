# Generated by Django 4.2.19 on 2025-04-05 02:42

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Cliente",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("nome", models.CharField(max_length=100)),
                ("telefone", models.CharField(default="00000000000000", max_length=15)),
                ("email", models.EmailField(max_length=254)),
                (
                    "data_cadastro",
                    models.DateTimeField(default=django.utils.timezone.now),
                ),
            ],
        ),
    ]
