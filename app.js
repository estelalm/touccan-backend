/**
 * Autores: Estela Alves, Gustavo de Campos, Nathalia Kawakami
 * Data: 03 set. 2024
 * Versão: 2.0
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
const controller_cliente = require('./controller/controller_cliente.js')
const controller_bico = require('./controller/controller_bico.js')
const controller_categoria = require('./controller/controller_categoria.js')
const controller_dificuldade = require('./controller/controller_dificuldade.js')
/** Usuário */

app.post('/2.0/touccan/usuario', cors(), bodyParserJSON, async function(request, response){
    let contentType = request.headers['content-type']
    let data = request.body
    let result = await controller_usuario.postUser(data, contentType)
    
    response.status(result.status_code)
    response.json(result)
})
app.get('/2.0/touccan/usuario', cors(), async function(request, response){
    let result = await controller_usuario.getUser()

    response.status(result.status_code)
    response.json(result)
})
app.get('/2.0/touccan/usuario/:id', cors(), async function(request, response){
    let idUser = request.params.id
    let result = await controller_usuario.getUserId(idUser)

    response.status(result.status_code)
    response.json(result)
})
app.post('/2.0/touccan/login/usuario', cors(), bodyParserJSON, async function(request, response){
    let contentType = request.headers['content-type']
    let data = request.body 
    console.log(data)
    let result = await controller_usuario.postUserLogin(data, contentType)

    response.status(result.status_code)
    response.json(result)
})


/** Cliente */
app.post('/2.0/touccan/cliente', cors(), bodyParserJSON, async function(request, response){
    let contentType = request.headers['content-type']
    let data = request.body
    let result = await controller_cliente.postClient(data, contentType)
    
    response.status(result.status_code)
    response.json(result)
})
app.get('/2.0/touccan/cliente', cors(), async function(request, response){
    let result = await controller_cliente.getClient()

    response.status(result.status_code)
    response.json(result)
})
app.get('/2.0/touccan/cliente/:id', cors(), async function(request, response){
    let idClient = request.params.id
    let result = await controller_cliente.getClientId(idClient)
    
    response.status(result.status_code)
    response.json(result)
})
app.post('/2.0/touccan/login/cliente', cors(), bodyParserJSON, async function(request, response){
    let contentType = request.headers['content-type']
    let data = request.body 
    let result = await controller_cliente.callClientLogin(data, contentType)

    response.status(result.status_code)
    response.json(result)
})


/** Bico */
app.post('/2.0/touccan/bico', cors(), bodyParserJSON, async function(request, response){
    let contentType = request.headers['content-type']
    let data = request.body
    let result = await controller_bico.postBico(data, contentType)

    response.status(result.status_code)
    response.json(result)
})

app.get('/2.0/touccan/bico', cors(), async function(request,response) {
    let result = await controller_bico.getBico()

    response.status(result.status_code)
    response.json(result)
})

/** CATEGORIA */
app.get('/2.0/touccan/categoria', cors(), async function(request, response) {
    let result = await controller_categoria.getCategory()

    response.status(result.status_code)
    response.json(result)
})


/** DIFICULDADE */
app.get('/2.0/touccan/dificuldade', cors(), async function(request, response) {
    let result = await controller_dificuldade.getDifficulty()

    response.status(result.status_code)
    response.json(result)
})

app.listen('8080', function(){
    console.log('API funcionando!!')
})