# salonUp ✂️💈

**Gestão Simplificada para Salões de Beleza e Barbearias**  
*Conectando profissionais e clientes com elegância e praticidade.*

---

## 🚀 Visão Geral
O **salonUp** é um micro-SaaS desenvolvido para simplificar a gestão de salões de beleza e barbearias. Nosso MVP foca em:
- Agendamento intuitivo de serviços.
- Controle de clientes e profissionais.
- Aplicativo mobile integrado para clientes.
- Relatórios básicos de faturamento e atendimentos.

**Link do Repositório Mobile (App Cliente):** [salonup-mobile](https://github.com/slvajunior/SalonUp.git) *(em breve)*

---

## ✨ Funcionalidades Principais (MVP)
### **Para Administradores/Profissionais**
- 📅 Agenda visual com horários disponíveis.
- 👥 Cadastro de clientes e serviços.
- 💬 Notificações automáticas (confirmação de agendamentos).
- 📊 Dashboard com métricas básicas (receita, serviços populares).

### **Para Clientes (Mobile App)**
- 🔍 Busca de salões/barbearias parceiras.
- 🕒 Agendamento rápido via app.
- 🔔 Lembretes personalizados.
- ⭐ Avaliação de serviços.

---

## 🛠️ Tecnologias Utilizadas
| **Backend**        | **Frontend (Admin)**  | **Mobile (Clientes)**  | **Banco de Dados**    | **Outras Ferramentas**      |
|--------------------|-----------------------|------------------------|-----------------------|-----------------------------|
| Python (Django)    | Vit+React             | React Native           | MySQL                 | Docker                      |
| Django             | Tailwind CSS          | Expo                   | Prisma ORM            | JWT para Autenticação       |
| REST API           | Redux Toolkit         | Context API            | Redis (Cache)         | SendGrid (E-mails)
---

## 📥 Instalação Local
Siga os passos abaixo para configurar o projeto em ambiente de desenvolvimento:

### Pré-requisitos
- Node.js v18+
- PostgreSQL instalado.
- Yarn ou NPM.

### Passos
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/salonup.git
   cd salonup