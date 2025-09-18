# Sistema de Delivery - Sabor Express

Sistema completo de delivery inspirado no iFood, com PWA para clientes e painel administrativo para donos de negócio.

## 🚀 Características

- **PWA Completo**: App mobile-first com service worker, cache offline e "Add to Home Screen"
- **Tempo Real**: Atualizações via Socket.IO para pedidos em tempo real
- **Sistema de Perguntas**: Modificadores personalizáveis como tamanho, adicionais, observações
- **Kanban de Pedidos**: Painel administrativo com board em tempo real
- **Persistência JSON**: Banco de dados simples em memória com arquivos JSON
- **Identidade Própria**: Design original sem uso de marcas registradas

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- Socket.IO para tempo real
- JWT para autenticação
- Express Validator para validação
- Persistência em arquivos JSON

### Frontend PWA (Cliente)
- React 18 + Vite
- Tailwind CSS
- Zustand para estado
- Service Worker com cache
- React Router DOM

### Frontend Admin (Painel)
- React 18 + Vite
- Tailwind CSS
- Zustand para estado
- Socket.IO Client
- React Router DOM

## 📁 Estrutura do Projeto

```
/
├─ backend/                 # API Node.js + Express
│  ├─ server.js            # Servidor principal
│  ├─ routes/              # Rotas da API
│  ├─ sockets/             # Socket.IO handlers
│  ├─ middleware/          # Middlewares (auth, error)
│  ├─ utils/               # Utilitários (db, id)
│  └─ data/                # Arquivos JSON (persistência)
├─ apps/
│  ├─ pwa/                 # PWA do Cliente
│  │  ├─ src/pages/        # Páginas (Home, Product, Cart, etc)
│  │  ├─ src/components/   # Componentes reutilizáveis
│  │  ├─ src/store/        # Estado global (Zustand)
│  │  └─ src/services/     # Serviços (API)
│  └─ admin/               # Painel Administrativo
│     ├─ src/pages/        # Páginas (Dashboard, Orders, etc)
│     ├─ src/components/   # Componentes reutilizáveis
│     ├─ src/store/        # Estado global (Zustand)
│     └─ src/services/     # Serviços (API)
└─ package.json            # Scripts principais
```

## 🚀 Como Rodar

### 1. Instalação
```bash
npm run install:all
```

### 2. Desenvolvimento (3 serviços simultâneos)
```bash
npm run dev
```

Isso irá iniciar:
- Backend: http://localhost:3000
- PWA Cliente: http://localhost:5175
- Painel Admin: http://localhost:5174

### 3. Build para Produção
```bash
npm run build
```

### 4. Rodar Produção
```bash
npm start
```

## 👤 Acesso Administrativo

**Credenciais padrão:**
- Email: `admin@delivery.com`
- Senha: `admin123`

## 📱 Funcionalidades do PWA

### Cliente
- ✅ Navegação por categorias
- ✅ Visualização de produtos com imagens
- ✅ Sistema de perguntas/modificadores (single, multiple, text)
- ✅ Cálculo dinâmico de preços
- ✅ Carrinho com edição de itens
- ✅ Checkout completo (dados, endereço, pagamento)
- ✅ Rastreamento de pedidos em tempo real
- ✅ PWA completo (service worker, cache, offline)

### Administrador
- ✅ Dashboard com KPIs e estatísticas
- ✅ Kanban de pedidos em tempo real
- ✅ CRUD completo de produtos e categorias
- ✅ Sistema de perguntas personalizáveis
- ✅ Configurações da loja (horários, taxas, métodos pagamento)
- ✅ Notificações sonoras para novos pedidos
- ✅ Autenticação JWT

## 🔧 Configuração

### Dados Iniciais
O sistema já vem com dados de demonstração:
- 3 categorias (Pizzas, Lanches, Bebidas)
- 3 produtos exemplo com perguntas configuradas
- 1 usuário admin
- Configurações da loja

### Modificando Dados
Os dados estão em `backend/data/` em arquivos JSON:
- `products.json` - Produtos e perguntas
- `categories.json` - Categorias
- `orders.json` - Pedidos
- `users.json` - Usuários admin
- `settings.json` - Configurações da loja

## 🎯 Fluxo Completo de Teste

1. **PWA Cliente** (http://localhost:5175):
   - Navegue pelas categorias
   - Selecione um produto (ex: Pizza Marguerita)
   - Escolha tamanho, adicionais e observações
   - Adicione ao carrinho
   - Vá para checkout
   - Preencha dados e finalize pedido
   - Acompanhe o rastreamento

2. **Painel Admin** (http://localhost:5174):
   - Faça login com as credenciais
   - Veja o pedido chegando no kanban
   - Mova entre os status: Aceito → Preparo → Pronto → A Caminho → Concluído
   - Observe as atualizações em tempo real no PWA

## 🔄 Tempo Real

- Novos pedidos aparecem instantaneamente no painel
- Mudanças de status são refletidas no rastreamento do cliente
- Notificações sonoras para novos pedidos no painel
- Conexões Socket.IO separadas para admin e clientes

## 📦 PWA Features

- ✅ Manifest.json configurado
- ✅ Service Worker com cache estratégico
- ✅ Funciona offline (shell e assets)
- ✅ "Add to Home Screen"
- ✅ Ícones para diferentes tamanhos
- ✅ Theme color personalizado

## 🎨 Design System

### Cores Principais
- **Primary Orange**: #DF2C2D (botões, destaques)
- **Success Green**: #10B981 (confirmações, status positivos)
- **Blue**: #3B82F6 (informações, status neutros)

### Componentes
- Cards com shadow sutil
- Botões com estados hover/disabled
- Toasts para feedback
- Loading spinners personalizados
- Status badges coloridos

## 🔐 Segurança

- JWT para autenticação administrativa
- Validação de entrada com express-validator
- Sanitização de dados
- CORS configurado
- Rotas protegidas no painel admin

## 📄 Licença

Este projeto é um exemplo educacional. Não utiliza marcas registradas de terceiros e possui identidade visual própria.

## 🤝 Contribuição

Este é um projeto de demonstração. Sinta-se livre para usar como base para seus próprios projetos.

---

**Desenvolvido com ❤️ usando React, Node.js e muito café ☕**