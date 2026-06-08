import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";
import request from "supertest";

import app from "../../../src/app";
import {
  carrinhosIniciais,
  produtosIniciais,
} from "../../../src/database/seeds/dados-iniciais";
import { Carrinho } from "../../../src/model/carrinho";
import { carrinhoRepository } from "../../../src/repository/carrinhos";

let response: request.Response;

const carrinhoParaSalvar: Carrinho = {
  itens: [
    {
      ...produtosIniciais[0]!,
      quantidade: 3,
    },
  ],
};

Given("existem carrinhos cadastrados", async function () {
  await carrinhoRepository.replaceAll(carrinhosIniciais);
});

When(
  "eu envio uma requisição GET de carrinho para {string}",
  async function (endpoint: string) {
    response = await request(app).get(endpoint);
  },
);

When(
  "eu envio uma requisição POST de carrinho para {string}",
  async function (endpoint: string) {
    response = await request(app).post(endpoint).send(carrinhoParaSalvar);
  },
);

Then(
  "o status da resposta de carrinho deve ser {int}",
  function (statusCode: number) {
    expect(response.status).to.equal(statusCode);
  },
);

Then("a resposta deve conter o último carrinho cadastrado", function () {
  const ultimoCarrinho = carrinhosIniciais.at(-1);

  expect(ultimoCarrinho).to.not.equal(undefined);
  expect(response.body).to.deep.equal(ultimoCarrinho);
});

Then("a resposta deve conter o carrinho salvo", function () {
  expect(response.body).to.deep.equal(carrinhoParaSalvar);
});
