const avaliacaoDAO = require('../model/DAO/avaliacao.js')
const message = require('./modulo/config.js')

const postRatingUser = async function (data, contentType) {
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
                let rtnDAO = await avaliacaoDAO.insertRatingUser(data)
                if (rtnDAO) {
                    console.log(rtnDAO);
                    let lastID = await avaliacaoDAO.lastIDRatingUser()
                    json.avaliacao = await avaliacaoDAO.selectRatingUserByID(lastID[0].id)
                    json.status = message.SUCCESS_CREATED_ITEM.status
                    json.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    json.message = message.SUCCESS_CREATED_ITEM.message
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
                    console.log(rtnDAO);
                    let lastID = await avaliacaoDAO.lastIDRatingClient()
                    json.avaliacao = await avaliacaoDAO.selectRatingClientByID(lastID[0].id)
                    json.status = message.SUCCESS_CREATED_ITEM.status
                    json.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    json.message = message.SUCCESS_CREATED_ITEM.message
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