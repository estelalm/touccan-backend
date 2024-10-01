const axios = require('axios')
const bicoDAO = require('../model/DAO/bico.js')
const message = require('./modulo/config.js')
const controller_cliente = require('./controller_cliente.js')

const postBico = async function(data, contentType) {
    try {
        if(String(contentType).toLowerCase()=='application/json'){            
            if (
                data.titulo == '' || data.titulo == undefined || data.titulo == null || data.titulo.length > 100 ||
                data.descricao == '' || data.descricao == undefined || data.descricao == null || data.descricao.length > 500 ||
                data.horario_inicio == '' || data.horario_inicio == undefined || data.horario_inicio == null || data.horario_inicio.length != 8 ||
                data.data_inicio == '' || data.data_inicio == undefined || data.data_inicio == null || data.data_inicio.length != 10 ||
                data.horario_limite == '' || data.horario_limite == undefined || data.horario_limite == null || data.horario_limite.length != 8 ||
                data.data_limite == '' || data.data_limite == undefined || data.data_limite == null || data.data_limite.length != 10 ||
                data.salario == '' || data.salario == undefined || data.salario == null || isNaN(data.salario) ||
                data.id_dificuldade == '' || data.id_dificuldade == undefined || data.id_dificuldade == null ||
                data.id_categoria == '' || data.id_categoria == undefined || data.id_categoria == null ||
                data.id_cliente == '' || data.id_cliente == undefined || data.id_cliente == null
            )
                return message.ERROR_REQUIRED_FIELDS   

            else{
                let json={}
                let rtnDAO=await bicoDAO.insertBico(data)
                if(rtnDAO){
                    let lastID = await bicoDAO.lastID()
                    json.bico=data
                    json.status=message.SUCCESS_CREATED_ITEM.status
                    json.status_code=message.SUCCESS_CREATED_ITEM.status_code
                    json.message=message.SUCCESS_CREATED_ITEM.message
                    json.id=lastID[0].id
                    return json
                }
                else
                    return message.ERROR_INTERNAL_SERVER_DB
            }
        }
        else
            return message.ERROR_CONTENT_TYPE
    } catch (error) {
        console.error(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const getBico = async function() {
    try {
        let data=await bicoDAO.selectAllBicos()
        let json={}
        if(data){
            if(data.length>0){
                json.bicos=data
                json.quantidade=data.length
                json.status_code=200
                return json
            }else
                return message.ERROR_NOT_FOUND
        }else
            return message.ERROR_INTERNAL_SERVER_DB
    } catch (error) {
        console.error(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const getBicoByCEP = async function(cepUser) {
    try {
        //cepUser = '06622310'
        const url = `https://viacep.com.br/ws/${cepUser}/json/`
        const response = await axios.get(url)
        const jsonUser = response.data
        const clientCEPArray = []
        const bicos = await getBico()
        const clients = await controller_cliente.getClient()
        const clientsAux = clients.cliente
        const clientsArray = clientsAux.map(cliente => ({
            id: cliente.id,
            cep: cliente.cep
        }))
        const bicosArray = bicos.bicos
        for (const bico of bicosArray) {
            let client = await controller_cliente.getClientId(bico.id_cliente)
            clientCEPArray.push(client.cliente.cep)
        }
        const cepsAccepted = []
        const promises = clientCEPArray.map(async (cep) => {
            const url = `https://viacep.com.br/ws/${cep}/json/`
            const response = await axios.get(url)
            const json = response.data
            if (json.erro) {
                console.log(`Erro ao buscar CEP ${cep}: ${JSON.stringify(json)}`)
                return
            }
            if (json.bairro && jsonUser.bairro) {
                if (json.bairro.toUpperCase() === jsonUser.bairro.toUpperCase()) 
                    cepsAccepted.push(cep)
            }
            if (json.localidade && jsonUser.localidade) {
                if (json.localidade.toUpperCase() === jsonUser.localidade.toUpperCase()) 
                    cepsAccepted.push(cep)
            }
        })
        await Promise.all(promises)
        const idsAccepted = clientsArray
            .filter(cliente => cepsAccepted.includes(cliente.cep))
            .map(cliente => cliente.id)

        const bicosAccepted = bicosArray.filter(bico => idsAccepted.includes(bico.id_cliente))
        const otherBicos = bicosArray.filter(bico => !idsAccepted.includes(bico.id_cliente))
        const result = [...bicosAccepted, ...otherBicos]
        
        const json={}
        json.bicos=result
        json.quantidade=result.length
        json.status_code=200

        return json
    } catch (error) {
        console.error(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports={
    postBico,
    getBico,
    getBicoByCEP
}