<!-- ltex: language=pt-BR -->

# **MATERIAIS**

### Semana 1 (3/3/2026): Apresentação do programa analítico da disciplina

Apresentar aos estudantes o programa analítico da disciplina, explicitando objetivos, conteúdos, metodologia, critérios de avaliação e expectativas de desempenho ao longo do semestre.

### Semana 2 (10/3/2026): Introdução ao desenvolvimento ágil de software

Compreender os fundamentos do desenvolvimento ágil de software, com ênfase no Manifesto Ágil e nas práticas do Extreme Programming (XP), aplicando esses conceitos na definição inicial de histórias de usuário e na estimativa de esforço para o projeto de e-commerce da disciplina.

### Semana 3 (17/3/2026): Scrum e Kanban

Compreender os fundamentos de Scrum e Kanban como métodos ágeis para gerenciamento e organização do trabalho em projetos de software, aplicando esses conceitos em uma atividade prática de simulação do desenvolvimento de funcionalidades para o projeto de e-commerce da disciplina.

### Semana 4 (24/3/2026): Preparação do ambiente de desenvolvimento

**Estrutura de pastas**

- `apps`: front e back do app
  - `api`: backend
  - `web`: frontend
- `docs`: documentação, evidências, etc.
- `infra`: docker-compose, scripts, etc.

**Criar .gitignore**

- Criar pelo site https://www.toptal.com/developers/gitignore
- Criar por meio de plugin do VSCode: https://marketplace.visualstudio.com/items?itemName=piotrpalarz.vscode-gitignore-generator

**Criação de Repositório**

- Criação de conta no GitHub
- [Configuração do github na máquina](https://www.webdevdrops.com/en/git-no-windows-github)
  - [Para múltiplas contas](https://docs.google.com/presentation/d/1dP0ShOLKSDLRdYLy3qi099rHpvZcbhBHvjhr-8q_BOE/edit?usp=sharing)
- Criação do repositório do projeto. Sugestão de nome: `appecommerce`

**Preparação da base do projeto**

- Preparação da base da api

```bash
# Ir para a raiz do repositório (monorepo)
cd <PASTA_RAIZ_DO_SEU_REPO>

# Criar a pasta do backend
mkdir -p apps/api
cd apps/api

# Inicializar o projeto Node
npm init -y

# Instalar dependências de produção
npm i express cors dotenv

# Instalar dependências de desenvolvimento (TypeScript + types + dev server)
npm i -D typescript ts-node-dev ts-node @types/node @types/express @types/cors

# Inicializar o TypeScript (gera tsconfig.json)
npx tsc --init

# Criar pasta src
mkdir src

# Criar estrutura mínima de pastas e arquivos
touch src/app.ts src/server.ts

# Criar arquivos de ambiente (exemplo + local)
touch .env
```

- Configurar arquivo `tsconfig.ts`
  - abrir arquivo
  - Descomentar linhas 5 e 6
    ```TypeScript
    "rootDir": "./src",
    "outDir": "./dist",
    ```
  - substituir `"verbatimModuleSyntax": true,` por `"verbatimModuleSyntax": false,`

- Editar `./src/app.ts`

```typescript
import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

export default app;
```

- Editar `server.ts`

```typescript
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT: number = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

- Editar `package.json`

```json
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
```

- Verificar se está tudo ok

```bash
npm run dev
```

**Commit**

```bash
#  Primeiro commit (se o repo já estiver configurado)
git add .
git commit -m "chore(api): base do projeto"
```

### Semana 5 (31/3/2026): Introdução ao BDD e Atividade com LLM

#### [Behavior-Driven Development (BDD)](./BDD.md)

### Semana 6 (7/4/2026): Teste de Software: BDD

**Preparação do BDD**

- Instalar pacotes

```bash
npm i -D @cucumber/cucumber supertest @types/supertest chai @types/chai
```

- Configurar pastas

```bash
mkdir -p features
mkdir -p features/step-definitions
```

- Editar `package.json`

```json
"scripts": {
  "bdd": "cucumber-js"
}
```

- Editar `cucumber.js`
```js
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/step-definitions/**/*.ts'],
    paths: ['features/**/*.feature']
  }
}
```

**Testando o BDD**

- Editar o arquivo `features/hello.feature`

```text
Feature: Hello API

  Scenario: Acessar endpoint raiz
    When eu envio uma requisição GET para "/"
    Then o status da resposta deve der 200
```

- Editar o arquivo `features/step-definitions/hello.steps.ts`

```typescript
import { When, Then } from "@cucumber/cucumber";
import request from "supertest";
import { expect } from "chai";

import app from "../../src/app";

let response: request.Response;

When(
  "eu envio uma requisição GET para {string}",
  async function (endpoint: string) {
    response = await request(app).get(endpoint);
  },
);

Then("o status da resposta deve ser {int}", function (statusCode: number) {
  expect(response.status).to.equal(statusCode);
});
```

- Executar `npm run bdd`

#### [Principais códigos de status HTTP](./StatusHTTP.md)

**Exercício**: crie um cenário em `hello.feature` para tratar acesso a endpoints que não existem.

**Resposta** (com o cenário _Acessar endpoint inexistente_ é o mesmo do existente, a implementação é mantida):

```typescript
import { When, Then } from "@cucumber/cucumber";
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app";

let response: request.Response;

// Scenarios:
// Acessar endpoint raiz
// Acessar endpoint inexistente
When(
  "eu envio uma requisição GET para {string}",
  async function (endpoint: string) {
    // objeto de resposta da requisição GET
    response = await request(app).get(endpoint);
  },
);

Then("o status da resposta deve ser {int}", function (status: number) {
  expect(response.status).to.equal(status);
});
```

**Commit**

```bash
chore(bdd): setup inicial do BDD
```

**Criação dos principais cenários**

- Possíveis features
  - catálogo de produtos
  - carrinho de compras
  - checkout
  - conta e autenticação
  - pagamento
  - pedido
  - cupons e descontos
  - regras de negócios críticas

**Criar cenários para _Catálogo de produtos_**

- Editar o arquivo `api/features/catalogo.feature`

```gherkin
Feature: Catálogo de produtos
    Como visitante do e-commerce
    Quero visualizar e consultar os produtos
    Para decidir o que comprar

    Scenario: Visualizar lista de produtos
        When eu envio uma requisição GET "/produtos" para listar os produtos
        Then os produtos são listados e o status da resposta deve ser 200
```

**Implementar GET "/produtos"**

- Editar `.src/controller/produto.ts`

```typescript
import { Request, Response } from "express";

const products = [
  {
    nome: "Camiseta Básica",
    preco: 59,
    estoque: 20,
    categoria: "Camisetas",
  },
  {
    nome: "Calça Jeans Slim",
    preco: 149,
    estoque: 5,
    categoria: "Calças",
  },
];

export class ProductController {
  index(req: Request, res: Response) {
    return res.status(200).json(products);
  }
}
```

- Editar `./src/route/produto.ts`

```typescript
import { Router } from "express";
import { ProductController } from "../controller/produto";

const router = Router();
const productController = new ProductController();

router.get("/produtos", (req, res) => productController.index(req, res));

export default router;
```

- Editar `./src/app.ts`

```typescript
import express, { Request, Response } from "express";
import listarprodutos from "./route/produto";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

app.use(listarprodutos);

export default app;
```

**Implementar GET "/produtos/:id"**

- Editar `.src/features/catalogo.feature`

```gherkin
Scenario: Consultar detalhes de um produto
    Given que existem produtos cadastrados
    When eu envio uma requisição GET "/produtos/1" para consultar os detalhes do produto
    Then os detalhes do produto são retornados e o status da resposta deve ser 200
```

- Editar `src./feratures/step-definitions/catalogo.steps.ts`

```typescript
// Scenario: Consultar detalhes de um produto
// Given que existe um produto com id "1"
Given("que existem produtos cadastrados", function () {
  // Assumimos que há produtos cadastrados no sistema
});

// When eu envio uma requisição GET "/produtos/1" para consultar os detalhes do produto
When(
  "eu envio uma requisição GET {string} para consultar os detalhes do produto",
  async (endpoint: string) => {
    response = await request(app).get(endpoint);
  },
);

// Then os detalhes do produto são retornados e o status da resposta deve ser 200
Then(
  "os detalhes do produto são retornados e o status da resposta deve ser {int}",
  function (status: number) {
    expect(response.status).to.equal(status);
  },
);
```

- Editar `.src/controller/produto.ts`

```typescript
import { Request, Response } from "express";

const products = [
  {
    id: 1,
    // ...
  },
  {
    id: 2,
    // ...
  },
];

export class ProductController {
  // ...

  // Mostrar detalhes de um produto específico
  show(req: Request, res: Response) {
    const id = Number(req.params.id);

    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    return res.status(200).json(product);
  }
}
```

- Editar `./src/route/produto.ts`

```typescript
// ...
router.get("/produtos/:id", (req, res) => productController.show(req, res));
// ...
```

- Editar `./src/app.ts`

```typescript
// ...
import detalhesproduto from "./route/produto";

// ...

app.use(detalhesproduto);

// ...
```

**Implementar outros cenários**

```gherkin
  Scenario: Tentar visualizar produto inexistente
    When eu envio uma requisição GET para "/produtos/Produto Inexistente"
    Then o status da resposta deve ser 404

  Scenario: Filtrar produtos por categoria
    Given há produtos cadastrados por categoria
    When eu envio uma requisição GET "/produtos?categoria=Camisetas" para obter produtos de uma categoria
    Then os produtos da categoria são mostrados e o status da resposta deve ser 200

  Scenario: Verificar produto sem estoque
    Given há produtos cadastrados
    And estão com o estoque zerado
    When eu envio uma requisição GET "/produtos/id" de um produto com estoque zerado
    Then o produto é exibido e o status da resposta deve ser 200
```

### Semana 7 (14/4/2026): Teste de Software: TDD

**[Alunos devem atualizar o repositório para prosseguir](https://github.com/filipefernandesphd/ESWIII/tree/main)**

#### [Test-Driven Development (TDD)](./TDD.md)

#### Refatorar projeto

**Produto**

- Editar `./app/api/data/produtos.memory.ts`

```ts
// Mudar
export type Produto = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  categoria: string;
  destaque?: boolean;
  promocao?: boolean;
  novidade?: boolean;
};

// Para
import { Produto } from "../model/produto";
```

- Editar `./app/api/src/model/produto.ts`

```ts
export type Produto = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  categoria: string;
  destaque?: boolean;
  promocao?: boolean;
  novidade?: boolean;
};
```

**Categoria**

- Editar `./app/api/data/categorias.memory.ts`

```ts
// Mudar
export type Categoria = {
  id: number;
  categoria: string;
};

// Para
import { Categoria } from "../model/categoria";
```

- Editar `./app/api/model/categoria.ts`

```ts
export type Categoria = {
  id: number;
  categoria: string;
};
```

#### Preparando o ambiente

- Instalar pacote: `npm i -D jest ts-jest @types/jest`
- Editar `apps/api/jest.config.js`

```js
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.spec.ts"],
  clearMocks: true,
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.spec.json",
      },
    ],
  },
};
```

- Editar `apps/api/package.json`

```json
// Linha 11
"test:unit": "jest --runInBand",    // executa os testes de forma sequencial (um por vez)
"test:unit:watch": "jest --watch"   // sempre que salva um arquivo, os testes são executados automaticamente
```

- Editar `apps/api/tsconfig.spec.json`

```js
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "rootDir": ".",
    "types": ["node", "jest"]
  },
  "include": ["src/**/*.ts"]
}
```

- Editar `apps/api/tsconfig.json`

```typescript
// Linha 12
"types": ["node"],

// Linha 43
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts"]
}
```

#### Criar modelo do Carrinho

- Editar `./apps/api/src/model/carrinho.ts`

```ts
import { Produto } from "./produto";

// O ItemCarrinho é uma extensão do Produto, adicionando a quantidade do produto no carrinho
// Ele representa um item específico que o cliente deseja comprar, incluindo a quantidade desejada
// ItemCarrinho é tudo que Produto tem + um novo campo quantidade”
export type ItemCarrinho = Produto & {
  quantidade: number;
};

export type Carrinho = {
  itens: ItemCarrinho[];
};
```

#### Escrevendo os testes

- Editar `./apps/api/src/service/carrinho.spec.ts`

```ts
import { CarrinhoService } from "./carrinho";
import { Produto } from "../model/produto";
import { Carrinho } from "../model/carrinho";

describe("CarrinhoService", () => {
  let service: CarrinhoService;

  const produto1: Produto = {
    id: 1,
    nome: "Camiseta Básica",
    preco: 59,
    estoque: 20,
    categoria: "Camisetas",
    destaque: true,
    promocao: false,
    novidade: true,
  };

  const produto2: Produto = {
    id: 2,
    nome: "Calça Jeans Slim",
    preco: 149,
    estoque: 5,
    categoria: "Calças",
    destaque: false,
    promocao: true,
    novidade: false,
  };

  const produto3: Produto = {
    id: 3,
    nome: "Jaqueta de Couro",
    preco: 399,
    estoque: 0,
    categoria: "Jaquetas",
    destaque: true,
    promocao: false,
    novidade: false,
  };

  beforeEach(() => {
    service = new CarrinhoService();
  });

  describe("criar", () => {
    test("deve criar um carrinho vazio", () => {
      const carrinho = service.criar();

      expect(carrinho).toEqual({ itens: [] });
      expect(carrinho.itens).toHaveLength(0);
    });
  });

  describe("adicionarItem", () => {
    test("deve adicionar um novo item ao carrinho", () => {
      const carrinho = service.criar();

      service.adicionarItem(carrinho, produto1, 2);

      expect(carrinho.itens).toHaveLength(1);
      expect(carrinho.itens[0]).toEqual({
        ...produto1,
        quantidade: 2,
      });
    });

    test("deve lançar erro se a quantidade for menor ou igual a zero", () => {
      const carrinho = service.criar();

      expect(() => {
        service.adicionarItem(carrinho, produto1, 0);
      }).toThrow("A quantidade deve ser maior que zero");

      expect(() => {
        service.adicionarItem(carrinho, produto1, -1);
      }).toThrow("A quantidade deve ser maior que zero");
    });

    test("deve somar a quantidade quando o produto já existir no carrinho", () => {
      const carrinho = service.criar();

      service.adicionarItem(carrinho, produto1, 2);
      service.adicionarItem(carrinho, produto1, 3);

      expect(carrinho.itens).toHaveLength(1);
      expect(carrinho.itens[0].quantidade).toBe(5);
    });
  });

  describe("quantidadeDeItens", () => {
    test("deve retornar zero para um carrinho vazio", () => {
      const carrinho = service.criar();

      const total = service.quantidadeDeItens(carrinho);

      expect(total).toBe(0);
    });

    test("deve retornar a soma das quantidades dos itens", () => {
      const carrinho: Carrinho = {
        itens: [
          { ...produto1, quantidade: 2 },
          { ...produto2, quantidade: 3 },
        ],
      };

      const total = service.quantidadeDeItens(carrinho);

      expect(total).toBe(5);
    });
  });

  describe("calcularTotal", () => {
    test("deve retornar zero para um carrinho vazio", () => {
      const carrinho = service.criar();

      const total = service.calcularTotal(carrinho);

      expect(total).toBe(0);
    });

    test("deve calcular o valor total do carrinho", () => {
      const carrinho: Carrinho = {
        itens: [
          { ...produto1, quantidade: 2 }, // 59 * 2 = 118
          { ...produto2, quantidade: 1 }, // 149 * 1 = 149
        ],
      };

      const total = service.calcularTotal(carrinho);

      expect(total).toBe(267);
    });
  });

  describe("cenários integrando múltiplos métodos", () => {
    test("deve criar carrinho, adicionar itens e calcular quantidade total", () => {
      const carrinho = service.criar();

      service.adicionarItem(carrinho, produto1, 2);
      service.adicionarItem(carrinho, produto2, 1);

      const quantidade = service.quantidadeDeItens(carrinho);

      expect(quantidade).toBe(3);
    });

    test("deve criar carrinho, adicionar itens e calcular o total da compra", () => {
      const carrinho = service.criar();

      service.adicionarItem(carrinho, produto1, 2); // 118
      service.adicionarItem(carrinho, produto2, 1); // 149

      const total = service.calcularTotal(carrinho);

      expect(total).toBe(267);
    });

    test("deve acumular quantidade do mesmo produto e refletir nos cálculos", () => {
      const carrinho = service.criar();

      service.adicionarItem(carrinho, produto1, 1);
      service.adicionarItem(carrinho, produto1, 2);

      expect(service.quantidadeDeItens(carrinho)).toBe(3);
      expect(service.calcularTotal(carrinho)).toBe(177); // 59 * 3
    });

    test("deve adicionar três produtos diferentes e calcular quantidade e total corretamente", () => {
      const carrinho = service.criar();

      service.adicionarItem(carrinho, produto1, 1); // 59
      service.adicionarItem(carrinho, produto2, 2); // 298
      service.adicionarItem(carrinho, produto3, 1); // 399

      expect(service.quantidadeDeItens(carrinho)).toBe(4);
      expect(service.calcularTotal(carrinho)).toBe(756);
    });
  });
});
```

- Executar `npm run teset:unit` e o teste deve falhar
- Editar `./apps/api/src/service/carrinho.ts`

```js
import { Carrinho, ItemCarrinho } from "../model/carrinho";
import { Produto } from "../model/produto";

export class CarrinhoService {
  criar(): Carrinho {
    return { itens: [] };
  }

  adicionarItem(
    carrinho: Carrinho,
    produto: Produto,
    quantidade: number,
  ): void {
    if (quantidade <= 0) {
      throw new Error("A quantidade deve ser maior que zero");
    }

    const itemExistente = carrinho.itens.find(
      (item) => item.id === produto.id,
    );

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
      return;
    }

    const novoItem: ItemCarrinho = {
      ...produto,
      quantidade,
    };

    carrinho.itens.push(novoItem);
  }

  quantidadeDeItens(carrinho: Carrinho): number {
    return carrinho.itens.reduce(
      (total, item) => total + item.quantidade,
      0,
    );
  }

  calcularTotal(carrinho: Carrinho): number {
    return carrinho.itens.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0,
    );
  }
}
```

- Executar `npm run teset:unit` e o teste deve passar

#### Exercício

Escreva o BDD para o carrinho com a implementação da API.

Considere o arquivo `./apps/api/src/data/carrinho.memory.ts`

```ts
import { Carrinho } from "../model/carrinho";

let carrinhos: Carrinho[] = [
  {
    itens: [
      {
        id: 1,
        nome: "Camiseta Básica",
        preco: 59,
        estoque: 20,
        categoria: "Camisetas",
        destaque: true,
        promocao: false,
        novidade: true,
        quantidade: 2,
      },
      {
        id: 2,
        nome: "Calça Jeans Slim",
        preco: 149,
        estoque: 5,
        categoria: "Calças",
        destaque: false,
        promocao: true,
        novidade: false,
        quantidade: 1,
      },
    ],
  },
  {
    itens: [
      {
        id: 3,
        nome: "Jaqueta de Couro",
        preco: 399,
        estoque: 0,
        categoria: "Jaquetas",
        destaque: true,
        promocao: false,
        novidade: false,
        quantidade: 1,
      },
    ],
  },
];

export function setCarrinhos(newCarrinhos: Carrinho[]): void {
  carrinhos = newCarrinhos;
}

export function getCarrinhos(): Carrinho[] {
  return carrinhos;
}

export function clearCarrinhos(): void {
  carrinhos = [];
}
```

### Semana 8 (28/4/2026): IA para Engenharia de Software

### Semana 9 (5/5/2026): Avaliação AV1

### Semana 10 (12/5/2026): DevOps: Pipeline CI/CD

### Semana 11 (19/5/2026): DevOps: Docker

### Semana 12 (26/5/2026): Arquitetura limpa e Refatoração

### Semana 13 (9/6/2026): Avaliação AV2

### Semanas 14 a 20 (16 a 14/6/2026): Projeto Final: Desenvolvimento

#### 07/07/2026: Entrega do Relatório

#### 14/07/2026: Apresentação
