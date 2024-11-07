const denunciaDAO = require('../model/DAO/denuncia.js')
const message = require('./modulo/config.js')

const postReportUser = async function (data, contentType) {
    try {
        console.log(data);
        if (String(contentType).toLowerCase() == 'application/json') {
            if
                (data.id_usuario == '' || data.id_usuario == undefined || data.id_usuario == null || isNaN(data.id_usuario) ||
                data.id_cliente == '' || data.id_cliente == undefined || data.id_cliente == null || isNaN(data.id_cliente) ||
                data.id_bico == '' || data.id_bico == undefined || data.id_bico == null || isNaN(data.id_bico) ||
                data.denuncia == '' || data.denuncia == undefined || data.denuncia == null 
               ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let json = {}
                let rtnDAO = await denunciaDAO.insertReportUser(data)
                if (rtnDAO) {
                    console.log(rtnDAO);
                    let lastID = await denunciaDAO.lastIDReportUser()
                    json.denuncia = await denunciaDAO.selectReportUserByID(lastID[0].id)
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
const postReportClient = async function (data, contentType) {
    try {
        console.log(data);

        if (String(contentType).toLowerCase() == 'application/json') {
            if
                (data.id_usuario == '' || data.id_usuario == undefined || data.id_usuario == null || isNaN(data.id_usuario) ||
                data.id_cliente == '' || data.id_cliente == undefined || data.id_cliente == null || isNaN(data.id_cliente) ||
                data.id_bico == '' || data.id_bico == undefined || data.id_bico == null || isNaN(data.id_bico) ||
                data.denuncia == '' || data.denuncia == undefined || data.denuncia == null ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let json = {}
                let rtnDAO = await denunciaDAO.insertReportClient(data)
                if (rtnDAO) {
                    console.log(rtnDAO);
                    let lastID = await denunciaDAO.lastIDReportClient()
                    json.denuncia = await denunciaDAO.selectReportClientByID(lastID[0].id)
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
    postReportUser,
    postReportClient
}