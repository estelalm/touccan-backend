const avaliacaoDAO = require('../model/DAO/avaliacao.js')
const message = require('./modulo/config.js')

const postRatingUser = async function (data, contentType) {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            if
                (data.id_usuario == '' || data.id_usuario == undefined || data.id_usuario == null || isNaN(data.id_usuario) ||
                data.id_cliente == '' || data.id_cliente == undefined || data.id_cliente == null || isNaN(data.id_cliente) ||
                data.id_bico == '' || data.id_bico == undefined || data.id_bico == null || isNaN(data.id_bico) ||
                data.avaliacao == '' || data.avaliacao == undefined || data.avaliacao == null ||
                data.nota == '' || data.nota == undefined || data.nota == null || isNaN(data.nota)) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let json = {}
                let rtnDAO = await avaliacaoDAO.insertRatingUser(data)                
                if (rtnDAO) {                    
                    let lastID = await avaliacaoDAO.lastIDRatingUser()
                    json.avaliacao = await avaliacaoDAO.selectRatingUserByID(lastID[0].id)
                    let objectMessage
                    if(rtnDAO.meta.code === '1644') {
                        objectMessage = message.ERROR_USER_NOT_FOUND
                    } else {
                        objectMessage = message.SUCCESS_CREATED_ITEM 
                    }
                    json.status = objectMessage.status
                    json.status_code = objectMessage.status_code
                    json.message = objectMessage.message
                    return json
                }
                else
                    return message.ERROR_INTERNAL_SERVER_DB
            }
        } else {
            message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}
const postRatingClient = async function (data, contentType) {
    try {
        console.log(data);

        if (String(contentType).toLowerCase() == 'application/json') {
            if
                (data.id_usuario == '' || data.id_usuario == undefined || data.id_usuario == null || isNaN(data.id_usuario) ||
                data.id_cliente == '' || data.id_cliente == undefined || data.id_cliente == null || isNaN(data.id_cliente) ||
                data.id_bico == '' || data.id_bico == undefined || data.id_bico == null || isNaN(data.id_bico) ||
                data.avaliacao == '' || data.avaliacao == undefined || data.avaliacao == null ||
                data.nota == '' || data.nota == undefined || data.nota == null || isNaN(data.nota)) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let json = {}
                let rtnDAO = await avaliacaoDAO.insertRatingClient(data)
                if (rtnDAO) {
                    let lastID = await avaliacaoDAO.lastIDRatingClient()
                    json.avaliacao = await avaliacaoDAO.selectRatingClientByID(lastID[0].id)
                    let objectMessage
                    if(rtnDAO.meta.code === '1644') {
                        objectMessage = message.ERROR_CLIENT_NOT_FOUND
                    } else {
                        objectMessage = message.SUCCESS_CREATED_ITEM 
                    }
                    json.status = objectMessage.status
                    json.status_code = objectMessage.status_code
                    json.message = objectMessage.message
                    return json
                }
                else
                    return message.ERROR_INTERNAL_SERVER_DB
            }
        } else {
            message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    postRatingUser,
    postRatingClient
}