# Pet Family — Mobile

App de cuidado contínuo para pets, integrado à API Java PET-FAMILY-JAVA (Spring Boot).
Sprint 3 — Mobile Application Development.

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
| @expo/vector-icons, expo-linear-gradient | UI/design |

O backend consumido é o PET-FAMILY-JAVA (Spring Boot + Spring Security JWT + JPA + Flyway),
mantido no repositório `PET-FAMILY-JAVA-entrega3`. Nenhum arquivo do backend foi alterado nesta
entrega — o mobile apenas consome os endpoints já existentes.

---

## Como instalar e rodar

### Pré-requisitos

- Node.js 18+
- A API Java rodando localmente (`./mvnw spring-boot:run` no projeto `PET-FAMILY-JAVA`), na
  porta 9090, perfil `dev` (para ter as contas de demonstração — veja abaixo).

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

Depois, ajuste o valor de `EXPO_PUBLIC_API_URL` em `.env` conforme onde a API estiver acessível:

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

#### Uso futuro com a API publicada (Railway)

A API Java ainda será publicada em produção no Railway. Quando isso acontecer, o app não precisa
de nenhuma alteração de código — basta apontar o `.env` para a URL pública gerada pelo Railway:

```bash
EXPO_PUBLIC_API_URL=https://<nome-do-projeto>.up.railway.app
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
| Conta | `/about` | Tutor/Vet | Dados da conta logada, logout, sobre o projeto |

Dez telas distintas, todas acessíveis por Expo Router (grupos `(auth)` e `(tabs)`, com rotas
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

### 2. Lembretes / Cuidados preventivos (`/lembretes/*`, tela Lembretes)

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

## Assistente (Chat) — observação importante

O Chat consome um endpoint real da API (`POST /interacoes-ia`, `GET /interacoes-ia/pet/{petId}`),
restrito ao perfil Tutor. A integração mobile-API é real (autenticação, persistência no banco,
histórico por pet). A geração da resposta em si, porém, é feita por regras de palavras-chave no
backend (`InteracaoIAService`), não por um modelo de IA generativa de terceiros — por isso o Chat
não é contado como um dos dois CRUDs, apenas como uma terceira integração real.

---

## Organização do código

```
app/                    rotas (Expo Router) - (auth) publico, (tabs) protegido
src/
  components/           UI reutilizavel (forms, cards, estados de loading/erro/vazio)
  services/              api.ts (axios + interceptors) e um arquivo por recurso (*Api.ts)
  hooks/                 useQuery/useMutation por recurso + queryKeys.ts centralizado
  providers/             AuthProvider (sessao) e QueryProvider (TanStack Query)
  types/api.ts            contratos tipados espelhando os DTOs Java
  utils/validators.ts    validacoes e conversoes de data/hora (BR / ISO)
```

Nenhuma tela chama `axios` ou `fetch` diretamente, nem define `useQuery`/`useMutation` inline —
tudo passa pelos hooks de `src/hooks`.

---

## Testes executados

Executado neste ambiente de desenvolvimento:

- `npx tsc --noEmit` — sem erros de tipos.
- `npx expo export --platform android` — bundling completo com Metro, sem erros de import ou
  resolução, confirmando que todas as rotas (incluindo as dinâmicas `pets/[id]` e
  `agenda/[id]`) e todos os módulos resolvem corretamente.

Roteiro manual recomendado antes da gravação do vídeo:

1. Com a API Java rodando (`mvnw spring-boot:run`, perfil `dev`), abrir o app e cadastrar uma
   conta nova (Tutor) — confirmar que loga automaticamente.
2. Fechar o app completamente e reabrir — confirmar que a sessão persiste sem pedir login.
3. Cadastrar um pet, editar e excluir (com o alerta de dependências, se houver consultas ou
   lembretes vinculados).
4. Deslogar e logar como `veterinario@petfamily.com` — criar, editar e excluir um lembrete para
   um pet de algum tutor demo; deslogar e logar como esse tutor para ver o lembrete e concluí-lo.
5. Agendar uma consulta como tutor; como veterinário, realizar ou cancelar essa consulta.
6. Conferir o Dashboard (disponível apenas para o perfil Veterinário).
7. Testar sem internet ou com a API desligada — confirmar mensagem de erro e botão de retry.
8. Testar submissão de formulário inválido (data passada em lembrete ou consulta, campos vazios).
9. Deslogar e tentar voltar para uma tela interna — confirmar bloqueio e redirecionamento.
10. Logar com uma conta e depois com outra no mesmo aparelho — confirmar que os dados da conta
    anterior não aparecem (cache limpo no logout).

---

## Limitações reais

- A API não tem refresh token — sessões expiram em 24h e exigem novo login (comportamento
  esperado, tratado no app).
- Não existe endpoint público para criar uma conta Veterinário; fora do perfil `dev` do backend,
  essa conta precisaria ser provisionada diretamente no banco (fora do escopo desta entrega, que
  não altera o Java).
- A API não bloqueia exclusão de pets ou tutores com dependências (consultas, lembretes) — o app
  apenas avisa o usuário antes de confirmar, mas o bloqueio de negócio em si não existe no
  backend.
- Consultas não têm um endpoint de exclusão ou edição genérico — só `agendar`, `cancelar` e
  `realizar` — por isso não foram escolhidas como um dos dois CRUDs.
- O assistente usa respostas por regras no backend, não uma IA generativa real (ver seção acima).

---



## Entrega pelo GitHub Classroom

A entrega deve ocorrer exclusivamente pelo repositório oficial do GitHub Classroom, preservando o
histórico de commits existente. O link do vídeo publicado no YouTube deve ser informado no campo
indicado acima antes do envio final.

---

## Integrantes

| Nome | RM | Papel |
|---|---|---|
| Pedro Vaz | RM 566551 | Desenvolvedor Full Stack |
| João Victor Luiz Oliveira Resende | RM 565139 | Desenvolvedor e UX Designer |
| Felipe Kirschner Modesto | RM 561810 | Desenvolvedor |
| Vitor Dias dos Santos | RM 565422 | Desenvolvedor |

---

Pet Family Mobile — Sprint 3 — integrado à API PET-FAMILY-JAVA
