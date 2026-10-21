# Em Público 2026

Site do **XI Encontro Mineiro dos Estudantes do Campo de Públicas**, de 06 a 08 de novembro de 2026, na Fundação João Pinheiro, em Belo Horizonte.

Ele é um site estático (HTML, CSS e JS) e não precisa de build.

## Estrutura

```
index.html          página completa: estilos, conteúdo e lógica
js/preact.min.js    Preact 10.24.3, que desenha a página
js/dc-runtime.js    mini-runtime que monta o template do index.html
images/             fotos de coordenadores e palestrantes, fundo e favicon
```

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicar

- **GitHub Pages:** Settings › Pages › Source: *Deploy from a branch* › `main` / `(root)`.
- **Vercel / Netlify:** importe o repositório, sem comando de build e com o diretório de saída `/`.

## Como editar

O conteúdo está no `index.html`:

- **Textos fixos:** ficam no `<template id="dc-template">`.
- **Dados:** ficam em `renderVals()`, dentro do `<script>` no fim do arquivo. Lá estão palestrantes (`P`), programação (`D`), GTs (`G`), coordenadores (`C`) e perguntas frequentes (`F`).
- **Datas da contagem regressiva e do prazo de submissão:** no início de `renderVals()`.
- **Foto nova:** coloque o arquivo em `images/sp/` e adicione `img: 'images/sp/arquivo.jpg'` ao palestrante.
