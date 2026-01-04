# API Playwright Tests

Projeto de testes automatizados de API usando Playwright e TypeScript com respostas mockadas.

**Visão geral**

- Testes de endpoints (baseados em ReqRes) usando Playwright.
- Interceptação de requisições via `page.route()` em `helpers/apiMocks.ts`.
- Chamadas HTTP executadas dentro do contexto do browser via `page.evaluate()` em `helpers/apiClient.ts`.

**Principais arquivos**

- [helpers/apiClient.ts](helpers/apiClient.ts) — Cliente simples que faz `GET/POST/PUT/PATCH/DELETE` usando `fetch` dentro de `page.evaluate()`.
- [helpers/apiMocks.ts](helpers/apiMocks.ts) — Funções que interceptam rotas (`mockUsers`, `mockUpdateUser`, `mockDeleteUser`, `mockUnknown`, `mockRegister`).
- [tests/api/users.api.spec.ts](tests/api/users.api.spec.ts) — Suite de testes que utiliza os mocks e o `ApiClient`.
- `playwright.config.ts`, `package.json`, `tsconfig.json` — configuração do projeto.

**Requisitos**

- Node.js (recomenda-se v16+)
- Dependências: gerenciadas via `package.json` (Playwright)

**Instalação**

```bash
npm install
npx playwright install
```

**Rodar os testes**

```bash
npx playwright test
```

Para abrir o relatório HTML gerado:

```bash
npx playwright show-report
# ou abra playground-report/index.html no navegador
```

**Como os mocks funcionam**

- Os testes chamam uma função de mock antes de executar requisições (por exemplo `await mockUsers(page)`), que registra rotas com `page.route()` e responde com payloads estáticos ou derivados do `postData`.
- Isso permite testar comportamento sem fazer chamadas reais à API externa.

**Sobre `ApiClient`**

- Implementado em `helpers/apiClient.ts` e usa `page.evaluate()` + `fetch()` para executar requisições HTTP no contexto da página.
- Vantagem: pode reutilizar o mesmo mecanismo de interceptação de `page.route()` usado nos testes.
- Limitação: não usa a API de requests nativa do Playwright (`APIRequestContext`) — que é mais adequada para testes de API puros.

**Refatoração sugerida (opcional)**

- Para usar `APIRequestContext` (mais direto para testes de API), troque `ApiClient` por chamadas ao `request` fixture do Playwright:

```ts
// Exemplo dentro de um teste
test("GET users with request", async ({ request }) => {
  const resp = await request.get("https://reqres.in/api/users/2");
  expect(resp.status()).toBe(200);
  const body = await resp.json();
  expect(body.data.id).toBe(2);
});
```

- Vantagens: não é necessário `page.evaluate()`, `request` é feito fora do contexto de página e tem API mais rica para autenticação, cabeçalhos, timeouts, etc.

**Contribuição**

- Abra uma issue ou PR com melhorias nos mocks, cobertura de testes ou migração para `APIRequestContext`.

**Contato**

- Mantido pelo autor do repositório.
