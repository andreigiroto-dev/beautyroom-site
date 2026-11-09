# Guia de Hospedagem Gratuita — Beauty Room

Este guia mostra como colocar o site da **Beauty Room** no ar de forma 100% gratuita para testes ou produção.

---

## Opção 1: Netlify Drop (Mais Fácil e Rápido — sem cadastro no GitHub)

O **Netlify Drop** permite subir o site arrastando a pasta direto no navegador:

1. Acesse: [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Se ainda não tiver conta, crie uma gratuita (usando seu e-mail ou Google).
3. Na tela principal, arraste a pasta **`studio_beautyroom`** para a área indicada na página.
4. Em menos de 30 segundos, o Netlify gerará um link público seguro com HTTPS (ex: `https://beauty-room-lash.netlify.app`).
5. **Dica**: No painel do Netlify, em *Site configuration > Change site name*, você pode alterar o subdomínio para um nome personalizado (ex: `beautyroom-maua.netlify.app`).

---

## Opção 2: Vercel (Excelente e Muito Rápido)

1. Acesse: [https://vercel.com](https://vercel.com) e crie uma conta gratuita.
2. Você pode subir o projeto conectando sua conta ao GitHub ou instalando o CLI:
   ```bash
   npx vercel
   ```
3. O arquivo `vercel.json` já está configurado na raiz para publicar automaticamente a pasta `studio_beautyroom`.

---

## Opção 3: GitHub Pages (Ideal para manter versionado)

1. Crie um repositório no seu GitHub (ex: `beautyroom-site`).
2. Suba os arquivos do projeto para o repositório.
3. No GitHub, acesse **Settings > Pages**.
4. Em **Branch**, selecione `main` e a pasta `/ (root)`.
5. Salve. O site estará disponível em `https://seu-usuario.github.io/beautyroom-site/`.

---

## ✦ Como Testar Localmente no seu Computador

Basta dar dois cliques no arquivo:
`beautyroom_site_v2\studio_beautyroom\index.html`

Ele abrirá imediatamente no seu navegador (Chrome, Edge, Firefox, etc.) com todas as fotos, galeria e animações funcionando perfeitamente sem precisar de internet ou servidor!
