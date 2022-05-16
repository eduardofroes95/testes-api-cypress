/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contracts'
let token

describe('Testes da Funcionalidade Usuários', () => {
     before(() => {
          cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });

     it('Deve validar contrato de usuários', () => {
          //TODO: 
          cy.request('/usuarios').then(response => {
               return contrato.validateAsync(response.body)

          });
     })

     it('Deve listar usuários cadastrados', () => {
          //TODO: 
          cy.request({
               method: 'GET',
               url: '/usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(1000)
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          //TODO: 
          let newusuario = `Eduardo ${Math.floor(Math.random() * 1000)}`
          let newemail = `beltrano${Math.floor(Math.random() * 1000)}@qa.com.br`
          cy.cadastrarUsuario(token, newusuario, newemail, "teste")
               .then(response => {
                    let id = response.body._id
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               expect(response.status).to.equal(201)
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          //TODO: 
          let newusuario = `Eduardo ${Math.floor(Math.random() * 1000)}`
          cy.request({
               method: 'POST',
               url: '/usuarios',
               body: {
                    "nome": newusuario,
                    "email": `beltrano$email.com`,
                    "password": "teste",
                    "administrador": "true"
               },
               headers: { authorization: token },
               failOnStatusCode: false
          }).then(response => {
               expect(response.body.email).to.equal('email deve ser um email válido')
               expect(response.status).to.equal(400)
          })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          //TODO: 
          let newusuario = `Eduardo ${Math.floor(Math.random() * 1000)}`
          let newemail = `beltrano${Math.floor(Math.random() * 1000)}@qa.com.br`
          cy.cadastrarUsuario(token, newusuario, newemail, "teste")
               .then(response => {
                    let id = response.body._id

                    cy.request({
                         method: 'PUT',
                         url: `/usuarios/${id}`,
                         headers: { authorization: token },
                         body: {
                              "nome": newusuario,
                              "email": newemail,
                              "password": "teste",
                              "administrador": "true"
                         }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro alterado com sucesso')
                         expect(response.status).to.equal(200)
                    })
               })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          //TODO: 
          let newusuario = `Eduardo ${Math.floor(Math.random() * 1000)}`
          let newemail = `beltrano${Math.floor(Math.random() * 1000)}@qa.com.br`
          cy.cadastrarUsuario(token, newusuario, newemail, "teste")
               .then(response => {
                    let id = response.body._id

                    cy.request({
                         method: 'DELETE',
                         url: `/usuarios/${id}`,
                         headers: { authorization: token },
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                         expect(response.status).to.equal(200)
                    })
               })
     });


});

