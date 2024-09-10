const usuarioDAO = require('../model/DAO/usuario.js')
const message = require('./modulo/config.js')

const postUsuario = async function(data, contentType){
    try {
        if(String(contentType).toLocaleLowerCase() == 'application/json')
        {
            if (
                data.nome == '' || data.nome == undefined || data.nome == null || data.nome.length > 80 ||
                data.cpf == '' || data.cpf == undefined || data.cpf == null || data.cpf.length > 11 ||
                data.telefone == '' || data.telefone == undefined || data.telefone == null || data.telefone.length > 11 ||
                data.cep == '' || data.cep == undefined || data.cep == null || data.cep.length > 8 ||
                data.email == '' || data.email == undefined || data.email == null || data.email.length > 100 ||
                data.data_nascimento == '' || data.data_nascimento == undefined || data.data_nascimento == null || data.data_nascimento.length > 10 ||
                data.senha == '' || data.senha == undefined || data.senha == null || data.senha.length > 30
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let json = {}
                let rtnDAO = await usuarioDAO.insertUsuario(data)
                if(rtnDAO)
                {
                    let usuarios = await usuarioDAO.selectUsuarios()
                    json.prov  = usuarios
                    json.status = message.SUCCESS_CREATED_ITEM.status
                    json.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    json.message = message.SUCCESS_CREATED_ITEM.message
                    return json                  
                }
                else
                {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        }
        else
        {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getUsuarios = async function(){
    try {
        let dados = await usuarioDAO.selectUsuarios()
        let json = {}
        let infosJson = {}
        if (dados) 
        {
            let qnt = 0
            dados.forEach(element => {
                qnt = qnt + 1
            })
            i.quantidade = qnt
            json.infos = infosJson
            json.usuario = dados
            return json
        } 
        else 
        {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getUsuario = async function(id){
    try {
        let idU = id
        if (id == '' || idU == null || isNaN(idU) || id == undefined) 
        {
            return message.ERROR_INVALID_ID
        }
        else
        {
            let rtnUsuario = await usuarioDAO.selectUsuarioId(idU)
            if (rtnUsuario) 
            {
                if (rtnUsuario.length > 0) 
                {
                    
                } 
                else 
                {
                    
                }
            } 
            else 
            {
                return message.ERROR_INTERNAL_SERVER_DB    
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    getUsuarios,
    postUsuario
}