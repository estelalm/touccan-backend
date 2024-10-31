const usuarioDAO = require('../model/DAO/usuario.js')
const message = require('./modulo/config.js')

const postUser = async function(data, contentType){
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
                let rtnDAO = await usuarioDAO.insertUser(data)
                if(rtnDAO)
                {
                    let lastId = await usuarioDAO.lastID()
                    let idC = lastId[0].id
                    let user = await usuarioDAO.selectUserId(idC)
                    json.user  = user
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

const putUser = async function(data, contentType, id) {
    try {
        if(String(contentType).toLocaleLowerCase() == 'application/json'){
            if (
                data.nome == '' || data.nome == undefined || data.nome == null || data.nome.length > 80 ||
                data.cpf == '' || data.cpf == undefined || data.cpf == null || data.cpf.length > 11 ||
                data.telefone == '' || data.telefone == undefined || data.telefone == null || data.telefone.length > 11 ||
                data.cep == '' || data.cep == undefined || data.cep == null || data.cep.length > 8 ||
                data.email == '' || data.email == undefined || data.email == null || data.email.length > 100 ||
                data.data_nascimento == '' || data.data_nascimento == undefined || data.data_nascimento == null || data.data_nascimento.length > 10 ||
                data.senha == '' || data.senha == undefined || data.senha == null || data.senha.length > 30 ||
                data.foto == '' || data.foto == undefined || data.foto == null || data.foto.length > 200 || // supondo que a foto seja uma URL de até 200 caracteres
                data.biografia == '' || data.biografia == undefined || data.biografia == null || data.biografia.length > 500 || // limite de caracteres para biografia
                data.habilidade == '' || data.habilidade == undefined || data.habilidade == null || data.habilidade.length > 500 || // limite para habilidade
                data.id_formacao == undefined || data.id_formacao == null || isNaN(data.id_formacao) || // verifica se o id_formacao está definido
                data.id_disponibilidade == undefined || data.id_disponibilidade == null || isNaN(data.id_disponibilidade)// verifica se o id_disponibilidade está definido
            )
                return message.ERROR_REQUIRED_FIELDS
            else if(id==''||id==undefined||id==null||isNaN(id))
                return message.ERROR_INVALID_ID
            else{
                let user = await usuarioDAO.selectUserId(id)
                if(user){
                    let json={}
                    let rtnDAO=await usuarioDAO.updateUser(data, id)
                    if(rtnDAO){
                        json.usuario=data
                        json.status=message.SUCCESS_UPDATED_ITEM.status
                        json.status_code=message.SUCCESS_UPDATED_ITEM.status_code
                        json.message=message.SUCCESS_UPDATED_ITEM.message
                        return json
                    }
                    else
                        return message.ERROR_INTERNAL_SERVER_DB
                }
                else
                    return message.ERROR_NOT_FOUND
            }
                
        }
        else
            return message.ERROR_CONTENT_TYPE
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getUser = async function(){
    try {
        let dados = await usuarioDAO.selectUser()
        let json = {}
        if (dados) 
        {
            json.usuario = dados
            json.status = message.SUCCESS_FOUND_USER.status
            json.status_code = message.SUCCESS_FOUND_USER.status_code
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

const getUserId = async function(id){
    try {
        let idU = id
        if (idU == '' || idU == null || isNaN(idU) || idU == undefined) 
        {
            return message.ERROR_INVALID_ID
        }
        else
        {
            let json = {}
            let rtnUsuario = await usuarioDAO.selectUserId(idU)
            if (rtnUsuario) 
            {
                if (rtnUsuario.length > 0) 
                {
                    const element = rtnUsuario[0]
                    json.usuario = element
                    json.status = message.SUCCESS_FOUND_USER.status
                    json.status_code = message.SUCCESS_FOUND_USER.status_code
                    return json
                } 
                else 
                {
                    return message.ERROR_NOT_FOUND
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

const postUserLogin = async function(data, contentType){
    console.log(data)
    try {
        if (String(contentType).toLowerCase() == 'application/json'
        ) 
        {
            if(
                data.email == '' || data.email == undefined || data.email == null || data.email > 100 ||
                data.senha == ''    || data.senha == undefined || data.senha == null || data.senha > 30)
            {
               return message.ERROR_REQUIRED_FIELDS
            }
            else
            {
                let emailU = data.email
                let password = data.senha
                let rtnUsuario = await usuarioDAO.callLogin(emailU, password)
                if (rtnUsuario) 
                    {
                    if (rtnUsuario.length > 0) 
                    {
                        let id = rtnUsuario[0].f0
                        let json = {}
                        json.usuario = {id}
                        json.status = message.SUCCESS_FOUND_USER.status
                        json.status_code = message.SUCCESS_FOUND_USER.status_code
    
                        return json
                    } 
                    else 
                    {
                        return message.ERROR_USER_NOT_FOUND
                    }
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
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}
module.exports = {
    getUser,
    postUser,
    putUser,
    getUserId,
    postUserLogin
}