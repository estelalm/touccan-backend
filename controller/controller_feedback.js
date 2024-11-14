const avaliacaoDAO = require('../model/DAO/avaliacao.js')
const denunciaDAO = require('../model/DAO/denuncia.js')
const message = require('./modulo/config.js')

const feedbackUser = async function (id_usuario) {
    try {
        if (isNaN(id_usuario) || id_usuario == '' || id_usuario == null || id_usuario == undefined) {
            return message.ERROR_INVALID_ID
        } else {
            let rtnAv = await avaliacaoDAO.selectFeedbackUserRating(id_usuario)
            let rtnDe = await denunciaDAO.selectFeedbackUserReport(id_usuario)
            console.log(rtnAv);
            
            if (rtnAv || rtnDe) {
                let total = rtnAv.length + rtnDe.length
                let json = {
                    avaliacoes: rtnAv,
                    denuncias: rtnDe,
                    status: true,
                    status_code: 200,
                    quantidade: total,
                    quantidade_denuncias: rtnDe.length
                }
                return json

            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const feedbackClient = async function (id_cliente) {
    try {
        if (isNaN(id_cliente) || id_cliente == '' || id_cliente == null || id_cliente == undefined) {
            return message.ERROR_INVALID_ID
        } else {
            let rtnAv = await avaliacaoDAO.selectFeedbackClientRating(id_cliente)
            let rtnDe = await denunciaDAO.selectFeedbackClientReport(id_cliente)
            
            if (rtnAv || rtnDe) {
                let total = rtnAv.length + rtnDe.length
                let json = {
                    avaliacoes: rtnAv,
                    denuncias: rtnDe,
                    status: true,
                    status_code: 200,
                    quantidade: total,
                    quantidade_denuncias: rtnDe.length
                }
                return json

            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports={
    feedbackUser,
    feedbackClient
}