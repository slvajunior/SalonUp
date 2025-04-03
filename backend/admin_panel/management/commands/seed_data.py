from django.core.management.base import BaseCommand
from django.utils import timezone
from admin_panel.models import Salao, Pagamento
from clientes.models import Cliente
from agendamentos.models import Agendamento
import random
from datetime import timedelta


class Command(BaseCommand):
    help = "Cria dados de teste para o dashboard"

    def handle(self, *args, **options):
        # Cria 42 salões (incluindo os dois específicos do exemplo)
        saloes = []
        for i in range(1, 43):
            salao = Salao.objects.create(
                nome=f"Salão {'Elegance' if i == 1 else 'Belle Hair' if i == 2 else f'Modelo {i}'}",
                cidade=(
                    "São Paulo"
                    if i == 1
                    else "Rio de Janeiro" if i == 2 else f"Cidade {i}"
                ),
                estado=random.choice(["SP", "RJ", "MG", "RS", "PR"]),
                status="ativo",
                data_cadastro=timezone.now() - timedelta(days=random.randint(1, 365)),
            )
            saloes.append(salao)

        # Cria 1250 clientes associados aleatoriamente aos salões
        for i in range(1, 1251):
            Cliente.objects.create(
                nome=f"Cliente {i}",
                telefone=f"1199999{i:04}",
                email=f"cliente{i}@example.com",
                salao=random.choice(saloes),
                data_cadastro=timezone.now() - timedelta(days=random.randint(1, 365)),
            )

        # Cria 342 agendamentos e pagamentos (57 por mês, 6 meses)
        valores_mensais = [12000, 19000, 15000, 20000, 25000, 28450]

        for mes_idx, valor_total in enumerate(valores_mensais):
            for _ in range(57):  # 57 agendamentos por mês
                ag = Agendamento.objects.create(
                    cliente=random.choice(Cliente.objects.all()),
                    servico=random.choice(["Corte", "Pintura", "Manicure"]),
                    data_hora=timezone.now()
                    - timedelta(days=30 * (6 - mes_idx) + random.randint(1, 30)),
                    valor=valor_total / 5700,  # Valor médio por serviço
                    status="concluido",
                )

                Pagamento.objects.create(
                    agendamento=ag,
                    valor=ag.valor,
                    data_pagamento=ag.data_hora,
                    metodo=random.choice(["dinheiro", "cartão", "pix"]),
                )

        self.stdout.write(self.style.SUCCESS("✅ Dados de teste criados com sucesso!"))
