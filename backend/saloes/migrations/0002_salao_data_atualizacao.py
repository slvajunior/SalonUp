# Generated by Django 4.2.19 on 2025-04-05 10:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("saloes", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="salao",
            name="data_atualizacao",
            field=models.DateTimeField(auto_now=True),
        ),
    ]
