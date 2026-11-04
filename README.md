# Pet Family — Mobile

App de cuidado contínuo para pets, integrado à API Java PET-FAMILY-JAVA (Spring Boot).
Sprint 4 (entrega final) — Mobile Application Development.

📹 **Vídeo de apresentação (Sprint 4):** _link a ser adicionado após a gravação_

📹 Vídeo da Sprint 3: https://youtu.be/KfhxMpY1Bdk

---

## Problema e solução

Tutores costumam procurar a clínica apenas em emergências ou gatilhos óbvios (vacinação), o que
gera baixa recorrência, saúde preventiva negligenciada e um vínculo fraco entre tutor, pet e
clínica.

O Pet Family conecta tutor, pet e clínica veterinária em um só app:

- Cadastro e gestão dos pets do tutor.
- Cuidados preventivos (vacinas, vermifugação, check-ups) criados pelo veterinário e
  acompanhados pelo tutor.
- Agendamento e acompanhamento de consultas.
- Dashboard clínico com indicadores reais para o veterinário.
- Assistente de orientação para dúvidas rápidas do tutor.

Diferente da versão anterior (protótipo local, sem backend), este app agora consome a API Java
real: autenticação por JWT, dois perfis (Tutor/Veterinário) e dados persistidos no banco da
clínica, sem mocks e sem dados fictícios nos fluxos avaliados.

---

## Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| React Native + Expo (SDK 51) | App mobile |
| Expo Router (~3.5) | Navegação por arquivos, com grupos `(auth)` e `(tabs)` |
| TypeScript | Tipagem estática, incluindo os contratos da API |
| TanStack Query (`@tanstack/react-query`) | Cache, `useQuery`/`useMutation`, invalidação automática |
| Axios | Cliente HTTP centralizado (`src/services/api.ts`) |
| Expo SecureStore | Persistência segura do token JWT |
| Expo Notifications | Notificações locais de cuidados e consultas |
| @expo/vector-icons, expo-linear-gradient | UI/design |


---

## Como instalar e rodar

### Pré-requisitos

- Node.js 18+
- Nenhuma API local é necessária: o app já aponta para a API Java e para a API de IA publicadas no
  Render. Para rodar a API Java localmente (opcional, perfil `dev` para ter as contas de
  demonstração), use `./mvnw spring-boot:run` no projeto `PET-FAMILY-JAVA`, na porta 9090.

### Instalação

```bash
npm install
```

### Configuração da API (variável de ambiente)

O app lê a URL da API a partir da variável `EXPO_PUBLIC_API_URL`, definida em um arquivo `.env`
na raiz do projeto (lido em `src/services/api.ts`). Esse arquivo não é versionado no repositório
(está no `.gitignore`), então cada ambiente precisa criar o seu a partir do `.env.example`:

```bash
cp .env.example .env
```

O `.env.example` já vem apontando para a API publicada (Render) e para a API de IA (Render),
então o app funciona sem alterar nada. Variáveis disponíveis:

| Variável | Descrição | Padrão |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | API Java (autenticação, pets, lembretes, consultas, dashboard) | `https://petfamily-api.onrender.com` |
| `EXPO_PUBLIC_IA_API_URL` | API de IA do assistente PetDoc (Gemini) | `https://pet-family-ia.onrender.com` |

Para rodar a API Java localmente, ajuste o valor de `EXPO_PUBLIC_API_URL` em `.env` conforme onde
ela estiver acessível:

| Onde o app roda | Host da API Java | Exemplo de `EXPO_PUBLIC_API_URL` |
|---|---|---|
| Emulador Android (AVD) | `10.0.2.2` (alias do host dentro do emulador) | `http://10.0.2.2:9090` |
| Simulador iOS | `localhost` funciona normalmente | `http://localhost:9090` |
| Celular físico (Expo Go, mesma rede Wi-Fi) | IP local da máquina que roda a API | `http://192.168.0.10:9090` |

Para descobrir o IP da sua máquina no Windows: `ipconfig` → campo "Endereço IPv4" do adaptador de
rede em uso. O celular precisa estar na mesma rede Wi-Fi do computador, e o firewall do Windows
precisa permitir conexões na porta 9090.

Sempre que o arquivo `.env` for alterado, reinicie o Metro com cache limpo para que o novo valor
seja aplicado:

```bash
npx expo start -c
```

#### Usando a API publicada (Render)

A API Java está publicada em produção no Render (Swagger em `/swagger-ui/index.html`). Para apontar o app para ela, basta definir no
`.env`:

```bash
EXPO_PUBLIC_API_URL=https://petfamily-api.onrender.com
```

Depois de criar ou atualizar o `.env`, reinicie o Metro com `npx expo start -c` para que a nova
URL seja aplicada. Nenhuma outra configuração é necessária: o cliente HTTP (`src/services/api.ts`)
já lê a URL exclusivamente dessa variável de ambiente.

### Rodar

```bash
npx expo start
```

- Emulador Android: pressione `a` no terminal do Expo (ou escaneie o QR com Expo Go).
- iOS: pressione `i` (macOS) ou use o Expo Go.
- Celular físico: escaneie o QR Code com o app Expo Go.

---

## Autenticação, perfis e contas de demonstração

A autenticação é real, contra a API Java (`POST /auth/login`, `POST /auth/registrar`,
`GET /auth/me`):

- Cadastro cria sempre uma conta do tipo Tutor (a API não expõe endpoint público para criar
  Veterinário).
- Login retorna um JWT (validade padrão de 24h, sem refresh token — ao expirar, a API responde
  401 e o app desloga automaticamente, pedindo novo login).
- O token é guardado com Expo SecureStore (nunca a senha).
- Ao reabrir o app, a sessão é restaurada chamando `GET /auth/me` com o token salvo — se o token
  estiver inválido ou expirado, o app limpa a sessão e volta para o login sem mostrar dado nenhum.
- Logout limpa o SecureStore e o cache do TanStack Query (`queryClient.clear()`), evitando que
  dados da conta anterior fiquem visíveis para a próxima conta que logar no mesmo dispositivo.
- Rotas são protegidas por um guard em `app/_layout.tsx`: sem sessão válida, qualquer tela
  interna redireciona para `/onboarding` (bloqueia deep link e "voltar" após logout); com sessão
  válida, as telas de autenticação redirecionam para a Home.

Contas de demonstração (existem apenas com o backend rodando em perfil `dev`, via
`DataInitializer`):

| Perfil | E-mail | Senha |
|---|---|---|
| Tutor | `pedro@petfamily.com` | `senha123` |
| Veterinário | `veterinario@petfamily.com` | `senha123` |

Outros tutores demo: `joao@petfamily.com`, `maria@petfamily.com`, `ana@petfamily.com`, mesma
senha.

---

## Telas

| Tela | Rota | Perfil | Descrição |
|---|---|---|---|
| Onboarding | `/onboarding` | pública | Boas-vindas |
| Login | `/login` | pública | Autenticação real via API |
| Cadastro | `/register` | pública | Cria conta Tutor via API |
| Home | `/` | Tutor/Vet | Resumo do tutor (pet e cuidados pendentes) ou do veterinário (indicadores rápidos) |
| Meus Pets | `/pets` | Tutor/Vet | Lista de pets (CRUD completo — ver abaixo) |
| Novo/Editar Pet | `/pets/new`, `/pets/[id]` | Tutor/Vet | Formulário de pet |
| Lembretes | `/agenda` | Tutor/Vet | Cuidados preventivos (CRUD completo — ver abaixo) |
| Novo/Editar Lembrete | `/agenda/new`, `/agenda/[id]` | Veterinário | Criação e edição de cuidados |
| Consulta | `/appointment` | Tutor/Vet | Agendamento (Tutor) ou agenda clínica (Veterinário) |
| Clínica (Dashboard) | `/dashboard` | Veterinário | Indicadores reais (`GET /dashboard/resumo`) |
| Chat | `/chat` | Tutor | Assistente com respostas geradas pela API (ver observação abaixo) |
| Sobre | `/about` | Tutor/Vet | Dados da conta, aparência (tema), permissão de notificações, **Sobre o App** (versão, data do build e hash do commit), logout e sobre o projeto |

Onze telas distintas, todas acessíveis por Expo Router (grupos `(auth)` e `(tabs)`, com rotas
aninhadas em `pets/` e `agenda/`).

---

## Os dois CRUDs completos

Escolhidos a partir do contrato real da API (nem todo recurso tem os quatro métodos — por
exemplo, Consultas só tem `agendar`, `cancelar` e `realizar`, sem DELETE real, então não serve
como CRUD completo).

### 1. Pets (`/pets/*`, tela Meus Pets)

Acessível ao Tutor para os próprios pets, e ao Veterinário para qualquer pet.

- Create — `/pets` → botão "+" → `POST /pets`.
- Read — lista (`GET /pets`) e detalhe (`GET /pets/{id}`).
- Update — tocar no pet → editar → `PUT /pets/{id}`.
- Delete — botão de lixeira na lista → confirmação (alerta se o pet tem consultas ou lembretes
  vinculados, pois a API remove tudo em cascata) → `DELETE /pets/{id}`.

Após qualquer mutação, a lista, o detalhe, a Home e o Dashboard (contadores) são invalidados e
atualizados automaticamente via TanStack Query, sem recarregar o app.

### 2. Lembretes / Cuidados preventivos (`/agenda/*`, tela Lembretes)

Na API, Create, Update e Delete são exclusivos do perfil Veterinário
(`@PreAuthorize("hasRole('VETERINARIO')")`); o Tutor só lê e conclui. Para demonstrar o CRUD
completo pela interface, entre com a conta de Veterinário:

- Create — logado como Veterinário, `/agenda` → botão "+" → escolher o pet → `POST /lembretes`.
- Read — lista para ambos os perfis (`GET /lembretes`, `GET /lembretes/meus` para o Tutor).
- Update — como Veterinário, tocar no ícone de editar em um lembrete pendente →
  `PUT /lembretes/{id}`.
- Delete — como Veterinário, ícone de lixeira → confirmação → `DELETE /lembretes/{id}`.

"Marcar como concluído" (Tutor, `POST /lembretes/{id}/concluir`) e "Cancelar" (Veterinário,
`POST /lembretes/{id}/cancelar`) são ações de negócio adicionais e não substituem o DELETE real,
que também está implementado.

---

## Notificações (locais)

O app usa notificações **locais** (`expo-notifications`), disparadas por eventos reais do fluxo do
Tutor — nada é manual nem fixo:

| Evento real | Notificação | Ao tocar |
|---|---|---|
| Tutor agenda uma consulta | Confirmação imediata ("Consulta agendada") | Abre **Consulta** |
| Consulta agendada (vinda da API) | Lembrete **24h** e **1h** antes do horário | Abre **Consulta** |
| Cuidado preventivo pendente (vacina, vermífugo, check-up) | Aviso na **véspera (18h)** e **no dia (9h)** | Abre **Lembretes** |
| Consulta cancelada/realizada, cuidado concluído/cancelado | Lembretes futuros são **cancelados** automaticamente | — |
| Logout | Todos os lembretes agendados são cancelados (nada vaza para a próxima conta) | — |

Em **Sobre → Notificações** o usuário vê se a permissão está ativa e pode ativá-la (ou abrir as
configurações do sistema, se tiver negado). Tocar em uma notificação com o app fechado abre a tela
correspondente uma única vez por sessão.

Camadas: `services/notificationsService.ts` encapsula o `expo-notifications` (permissão, canal
Android, agendamento); `services/reminderNotifications.ts` traduz lembretes e consultas da API em
notificações; `hooks/useNotifications.ts` pede a permissão, sincroniza os agendamentos sempre que os
dados da API mudam e navega para a tela certa ao tocar na notificação (app aberto, em segundo plano
ou fechado).

Para ver em ação, logado como Tutor: agende uma consulta na aba **Consulta** (a confirmação aparece
na hora) com horário daqui a pouco mais de 1h — o lembrete de 1h chega no momento certo. Cuidados
criados pelo Veterinário para o pet do tutor passam a ser agendados quando o Tutor abre o app.

---

## Tema claro e escuro

O app segue o tema do sistema por padrão e permite escolher **Sistema / Claro / Escuro** em
**Sobre → Aparência** (a escolha é persistida). Todas as telas e componentes usam as cores do tema
(`src/constants/colors.ts`, `src/providers/ThemeProvider.tsx` e o hook `useTheme`).

---

## Sobre o App e versão publicada

A aba **Sobre** exibe a versão e o **hash do commit** do qual o app foi gerado. O valor é injetado em
tempo de build por `app.config.js` (variável `EAS_BUILD_GIT_COMMIT_HASH` no EAS Build, ou
`git rev-parse HEAD` localmente), então o APK publicado aponta para o commit exato do repositório.
Se o build for feito com alterações não commitadas, a tela mostra "(alterações locais)" — por isso,
**faça o commit antes de gerar o build**.

---

## Publicação (Firebase App Distribution)

O passo a passo (build com EAS, upload no Firebase App Distribution e cadastro do professor como
tester) está em [docs/PUBLICACAO.md](docs/PUBLICACAO.md).

---

## Dados reais e atualização automática

Todos os dados de negócio (pets, lembretes, consultas, dashboard, conta) vêm da API — não há
mocks, listas fixas ou fallbacks fictícios nesses fluxos. O TanStack Query cuida de:

- Cache por recurso e filtro (`src/hooks/queryKeys.ts`).
- Invalidação automática de listas, detalhes e contadores relacionados após cada mutação (por
  exemplo, excluir um pet também invalida lembretes, consultas e o dashboard, já que a API os
  recalcula em cascata).
- Estados de carregamento, erro (com opção de tentar novamente) e vazio em todas as listas.
- Pull-to-refresh nas telas de lista.
- Limpeza do cache (`queryClient.clear()`) no logout, para não vazar dados entre contas no mesmo
  aparelho.

---

## Assistente (Chat) — PetDoc com IA generativa

O Chat (restrito ao perfil Tutor) consome o serviço de IA do repositório
[PET-FAMILY-IA](https://github.com/PET-FAMILYY/PET-FAMILY-IA): uma API FastAPI (PetDoc) publicada
no Render que gera as respostas com o Gemini (Google AI). A cada pergunta o app envia os dados do
pet selecionado (nome, espécie, raça, idade, peso e observações de saúde), que entram no
*system prompt* para personalizar a resposta.

- Endpoints: `POST /interacoes-ia` e `GET /interacoes-ia/pet/{petId}` (cliente em
  `src/services/interacoesIaApi.ts`).
- URL configurável por `EXPO_PUBLIC_IA_API_URL` (padrão: `https://pet-family-ia.onrender.com`).
- Se o Gemini estiver sobrecarregado (502/503/504), o app tenta até 3 vezes e depois exibe uma
  mensagem amigável.
- O histórico das conversas fica em memória no serviço de IA e é perdido quando ele reinicia.
- O plano gratuito do Render "dorme" por inatividade: a primeira pergunta pode demorar.

O Chat não é contado como um dos dois CRUDs, apenas como uma terceira integração real.

---

## Organização do código

```
app/                    rotas (Expo Router) - (auth) publico, (tabs) protegido; so montam a tela
src/
  components/           UI reutilizavel (forms, cards, GradientHeader, ThemedRefreshControl, estados)
    consultas/          visoes de Consulta por perfil (TutorConsultas, VetConsultas)
    about/              blocos da tela Sobre (conta, aparencia, notificacoes, versao/commit, equipe)
  constants/colors.ts   paletas clara e escura
  services/              api.ts (axios + interceptors), um arquivo por recurso (*Api.ts),
                         notificationsService.ts e reminderNotifications.ts (notificacoes locais)
  hooks/                 useQuery/useMutation por recurso (queryKeys.ts centralizado) e hooks de tela:
                         useAgendaLembretes, useLembreteActions, useAgendamentoForm,
                         useConsultaActions, useRefresh, useNotifications, useNotificationPermission
  providers/             AuthProvider (sessao), ThemeProvider (tema) e QueryProvider (TanStack Query)
  types/                 api.ts (contratos espelhando os DTOs Java) e icons.ts (nomes de icones tipados)
  utils/                 validators.ts (datas/horas BR e ISO), formValidation.ts (regras dos formularios),
                         dialogs.ts (alertas), lembretes.ts e chat.ts (regras puras), appInfo.ts
```

Nenhuma tela chama `axios` ou `fetch` diretamente, nem define `useQuery`/`useMutation` inline —
tudo passa pelos hooks de `src/hooks`. A lógica de tela (agrupar lembretes por status, formulário de
agendamento, ações com confirmação, montagem das mensagens do chat) também fica em hooks e `utils`,
não nos componentes. As regras de validação dos formulários ficam em `src/utils/formValidation.ts`,
os alertas padronizados em `src/utils/dialogs.ts` e o cabeçalho em gradiente é o componente
reutilizável `GradientHeader`. Para checar os tipos: `npm run typecheck`.

---


## Integrantes

| Nome | RM | Papel |
|---|---|---|
| Pedro Vaz | RM 566551 | Desenvolvedor Full Stack |
| João Victor Luiz Oliveira Resende | RM 565139 | Desenvolvedor e UX Designer |
| Felipe Kirschner Modesto | RM 561810 | Desenvolvedor |
| Vitor Dias dos Santos | RM 565422 | Desenvolvedor |

---

Pet Family Mobile — Sprint 4 — integrado à API PET-FAMILY-JAVA e à API de IA PET-FAMILY-IA
