/// <reference types="cypress"/>
let faker = require('faker');
let token
import contrato from '../contracts/produtos.contracts'

describe('Teste da funcionalidade produtos', () => {
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    });

    it('Deve validar contrato de produtos', () => {
        cy.request('/produtos').then(response =>{
            return contrato.validateAsync(response.body)
        })
    });

    it('Listar produtos', () => {
        cy.request({
            method: 'GET',
            url: '/produtos'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(1000)
        })
    })

    it('Cadastrar produto', () => {
        let produto = `Novo produto bacana da EBAC ${Math.floor(Math.random() * 1000)}`
        cy.request({
            method: 'POST',
            url: '/produtos',
            body: {
                "nome": produto,
                "preco": 500,
                "descricao": "Produto bacana23",
                "quantidade": 300
            },
            headers: { authorization: token }
        }).then(response => {
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            expect(response.status).to.equal(201)
        })
    })

    it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
        cy.cadastrarProduto(token, "Logitech MX Vertical", 500, "Produto Bacana", 50)

            .then((response) => {
                expect(response.body.message).to.equal('Já existe produto com esse nome')
                expect(response.status).to.equal(400)
            })
    });

    it('Deve editar um produto já cadastrado', () => {

        cy.request('produtos').then(response => {
            let id = response.body.produtos[2]._id
            let produto = `Novo produto bacana da EBAC ${Math.floor(Math.random() * 1000)}`
            cy.request({
                method: 'PUT',
                url: `/produtos/${id}`,
                headers: { authorization: token },
                body: {

                    "nome": produto,
                    "preco": 470,
                    "descricao": "Produto Editado",
                    "quantidade": 375
                }
            }).then(response => {
                expect(response.body.message).to.be.equal('Registro alterado com sucesso')
            })
        })
    })

    it('Deve editar um produto cadastrado previamente', () => {
        let produto = `Novo produto bacana da EBAC ${Math.floor(Math.random() * 1000)}`
        cy.cadastrarProduto(token, produto, 500, "Produto Bacana", 50)
            .then(response => {
                let id = response.body._id

                cy.request({
                    method: 'PUT',
                    url: `/produtos/${id}`,
                    headers: { authorization: token },
                    body: {
                        "nome": produto,
                        "preco": 470,
                        "descricao": "Produto Editado Editado",
                        "quantidade": 375
                    }
                })
            })
    })

    it('Deve deletar um produto previamente cadastrado', () => {
        let produto = `Novo produto bacana da EBAC ${Math.floor(Math.random() * 1000)}`
        cy.cadastrarProduto(token, produto, 500, "Produto Bacana", 50)
            .then(response => {
                let id = response.body._id

                cy.request({
                    method: 'DELETE',
                    url: `/produtos/${id}`,
                    headers: { authorization: token },
                }).then(response => {
                    expect(response.body.message).to.be.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
                })
            })

    });

})
