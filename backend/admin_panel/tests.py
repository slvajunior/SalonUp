import requests


BASE_URL = "http://localhost:8000/api/dashboard/"
TOKEN = "SEU_TOKEN_AQUI"  # Substitua pelo seu token


def test_dashboard_api(time_range):
    headers = {"Authorization": f"Token {TOKEN}"}
    response = requests.get(f"{BASE_URL}?range={time_range}", headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Erro: {response.status_code}")
        return None


# Testando para diferentes intervalos
for time_range in ["week", "month", "year"]:
    print(f"\nTestando para range={time_range}")
    data = test_dashboard_api(time_range)
    if data:
        print("Resposta recebida com sucesso!")
        print(f"Total de salões: {data['total_saloes']}")
        print(f"Faturamento: R$ {data['faturamento_mensal']}")
