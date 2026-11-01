# Publicação — Firebase App Distribution

Passo a passo para gerar o APK e distribuí-lo ao professor. A versão publicada precisa
corresponder **exatamente** ao código entregue, e a tela **Sobre** mostra o hash do commit.

## 0. Antes de tudo: commit limpo

O hash exibido no app vem do git. Gere o build **depois** de commitar tudo:

```bash
git status            # deve estar limpo
git log -1 --format=%H  # este e o hash que aparecera na tela "Sobre"
git push
```

## 1. Gerar o APK com EAS Build

```bash
npm install -g eas-cli
eas login
eas init                         # primeira vez: vincula o projeto e grava o projectId no app.json
eas build -p android --profile preview
```

- O perfil `preview` (em `eas.json`) gera um **APK** de distribuição interna, já com as URLs da API
  Java (Railway) e da API de IA (Render) embutidas.
- Ao final, baixe o `.apk` pelo link que o EAS mostra.
- O EAS informa o commit usado no build; confira se é o mesmo do passo 0.

## 2. Criar o projeto no Firebase

1. Acesse https://console.firebase.google.com e crie um projeto (ex.: `pet-family`).
2. **Adicionar app → Android**, com o nome do pacote **`com.petfamily.app`**
   (o mesmo de `app.json` → `android.package`). O `google-services.json` não é necessário para
   distribuição nem para notificações locais.
3. Anote o **App ID** do app Android (formato `1:123456789:android:abcdef...`).

## 3. Enviar para o App Distribution

Pelo console: **Release & Monitor → App Distribution → Get started**, arraste o `.apk` e adicione os
testers. Ou pela CLI:

```bash
npm install -g firebase-tools
firebase login
firebase appdistribution:distribute caminho/do/app.apk \
  --app <APP_ID_DO_FIREBASE> \
  --testers "email.institucional.do.professor@fiap.com.br" \
  --release-notes "Pet Family v1.0.0 - Sprint 4 (commit <hash>)"
```

## 4. Tester (professor)

- Cadastre o **e-mail institucional do professor** como tester (campo `--testers` acima, ou
  **App Distribution → Testers & Groups**).
- O professor recebe um e-mail do Firebase com o convite para instalar o app (no Android: aceitar o
  convite e instalar o APK).
- Teste o acesso antes da entrega: abra o convite com outra conta e confirme que instala e abre.

## 5. Checklist final

- [ ] Commit feito e enviado ao GitHub Classroom
- [ ] APK gerado a partir desse commit
- [ ] Hash na tela **Sobre** do APK instalado = `git log -1 --format=%H`
- [ ] Professor cadastrado como tester e convite funcionando
- [ ] Vídeo gravado com o **APK publicado** (mesma versão do código entregue)
- [ ] Vídeo mostra: login, CRUDs, consulta, chat de IA, **notificação chegando e abrindo a tela**,
      troca de tema e a tela Sobre com o hash
