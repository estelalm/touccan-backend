/**
 * Autores: Estela Alves, Gustavo de Campos, Nathalia Kawakami
 * Data: 03 set. 2024
 * Versão: 1.0
 * Objetivo: Criação de uma API para manipular dados de uma aplicação de serviços autônomos.
 */
/** Configurações */
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
app.use((request, response, next) =>{
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    app.use(cors())
    next()
})
const bodyParserJSON = bodyParser.json()


/**Imports */
const controller_usuario = require('./controller/controller_usuario.js')
const res = require('express/lib/response.js')

/** Usuário */

app.post('/1.0/touccan/usuario', cors(), bodyParserJSON, async function(request, response){
    let contentType = request.headers['content-type']
    let data = request.body
    let result = await controller_usuario.postUser(data, contentType)
    
    response.status(result.status_code)
    response.json(result)
})
app.get('/1.0/touccan/usuario', cors(), async function(request, response){
    let result = await controller_usuario.getUser()

    response.status(result.status_code)
    response.json(result)
})
app.get('/1.0/touccan/usuario/:id', cors(), async function(request, response){
    let idUser = request.params.id
    let result = await controller_usuario.getUserId(idUser)

    response.status(result.status_code)
    response.json(result)
})

app.listen('8080', function(){
    console.log('API funcionando!!')
})