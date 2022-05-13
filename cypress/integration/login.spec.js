/// <reference types="cypress"/>
let faker = require('faker');


describe('Teste da API SERVEREST', () => {


    it('Deve fazer login com sucesso', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/login',
            body: {
                "email": "fulano@qa.com",
                "password": "teste"
            }
        }).then((response) => {

            expect(response.status).equal(200)
            expect(response.body.message).equal('Login realizado com sucesso')
            cy.log(response.body.authorization)
        })

    });





});