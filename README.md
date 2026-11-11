# Portfólio João Torres

Site estático (HTML, CSS e JS puros). O mesmo `index.html` serve de fonte para o
portfólio e para o PDF do currículo.

## Geração do PDF do currículo

O botão **Baixar CV** da navbar baixa o arquivo `assets/CV-joaotorres-<versao>.pdf` (ex.: `CV-joaotorres-1ac84e.pdf`). O nome do arquivo baixado já leva a versão.
O botão só entrega esse arquivo; quem **cria/atualiza** o PDF é o script
`scripts/export-cv.mjs`, que você roda na sua máquina.

### Requisitos

- Node.js
- Chrome ou Edge instalado (o script usa o navegador em modo headless).
  Se não for encontrado, defina `CHROME_PATH` com o caminho do executável.

### Gerar / atualizar o PDF

Rode sempre que mudar o conteúdo do `index.html` (ex.: nova experiência):

```bash
node scripts/export-cv.mjs
```

Saída de exemplo:

```
Currículo gerado: ...\assets\CV-joaotorres-1ac84e.pdf (versão 1ac84e)
```

O script também grava a versão no rodapé do `index.html`, então site e PDF
ficam sempre com o mesmo código.

### Opções

| Comando | O que faz |
| --- | --- |
| `node scripts/export-cv.mjs` | PDF publicável, **com** telefone (se estiver no `cv.local.json`) |
| `node scripts/export-cv.mjs --public` | PDF publicável **sem** telefone, salvo em `assets/CV-joaotorres-<versao>.pdf` |
| `node scripts/export-cv.mjs "cv-output/meu-cv.pdf"` | PDF pessoal num caminho à sua escolha (não mexe no link do site) |
| `node scripts/export-cv.mjs --check` | Só confere se o PDF/site estão atualizados |

### Telefone e e-mail do CV

Ficam em `scripts/cv.local.json` (não vai para o repositório):

```json
{ "phone": "(11) 90000-0000", "email": "voce@exemplo.com" }
```

Sem esse arquivo, o PDF sai sem telefone e com o e-mail que está no `index.html`.

### Versão (código curto)

A versão é um código de 6 caracteres (ex.: `1ac84e`) calculado a partir do
conteúdo do `index.html`. Aparece no rodapé do site e no canto do cabeçalho do PDF.

- Mudou o conteúdo → o código muda ao rodar o script.
- Para conferir se está tudo em dia:

```bash
node scripts/export-cv.mjs --check
```

```
OK: PDF e site na versão 1ac84e.
```

ou, se você editou o HTML e esqueceu de regenerar:

```
DESATUALIZADO: conteúdo mudou (versão atual 9b21e4). Rode o export-cv.
```

Mudanças só no CSS não alteram o código (ele considera apenas o `index.html`).

### Fluxo para atualizar o currículo

1. Edite o `index.html` (ex.: adicione uma experiência).
2. Gere o PDF: `node scripts/export-cv.mjs`
3. Confira: `node scripts/export-cv.mjs --check` → deve dizer `OK`.
4. Faça commit do `index.html` e do `assets/CV-joaotorres-<versao>.pdf` e publique.

### Hook de pre-commit (local)

Existe `.git/hooks/pre-commit`, que roda o `--check` quando `index.html` ou o PDF
entram no commit e **bloqueia** o commit se o PDF/versão estiver desatualizado.
Ele fica só nesta máquina (hooks não vão para o repositório). Para recriar em
outra máquina, copie o conteúdo de `.git/hooks/pre-commit`.

### Dica

Sem o script, também dá para usar `Ctrl+P > Salvar como PDF` no navegador:
o CSS de impressão (`@media print` em `style.css`) já formata o layout de currículo.
