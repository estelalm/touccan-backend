const clienteDAO = require('../model/DAO/cliente.js')
const message = require('./modulo/config.js')

const postClient = async function(data, contentType){
    try {
        if(String(contentType).toLocaleLowerCase() == 'application/json')
        {
            if (
                data.nome_fantasia == '' || data.nome_fantasia == undefined || data.nome_fantasia == null || data.nome_fantasia.length > 100 ||
                data.razao_social == '' || data.razao_social == undefined || data.razao_social == null || data.razao_social > 100 ||
                data.email == '' || data.email == undefined || data.email == null || data.email.length > 100 ||
                data.telefone == '' || data.telefone == undefined || data.telefone == null || data.telefone.length > 11 ||
                data.cnpj == '' || data.cnpj == undefined || data.cnpj == null || data.cnpj.length > 14 ||
                data.cep == '' || data.cep == undefined || data.cep == null || data.cep.length > 8 ||
                data.senha == '' || data.senha == undefined || data.senha == null || data.senha.length > 30 ||
                data.cpf_responsavel == '' || data.cpf_responsavel == undefined || data.cpf_responsavel == null || data.cpf_responsavel.length > 11 ||
                data.nome_responsavel == '' || data.nome_responsavel == undefined || data.nome_responsavel == null || data.nome_responsavel.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let json = {}
                let rtnDAO = await clienteDAO.insertClient(data)
                if(rtnDAO)
                {
                    let lastId = await clienteDAO.lastID()
                    let idC = lastId[0].id
                    let client = await clienteDAO.selectClienteId(idC)
                    json.cliente  = client
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

const putClient = async function(data, contentType, id) {
    try {
        if(String(contentType).toLocaleLowerCase() == 'application/json'){
            if(id==''||id==undefined||id==null||isNaN(id))
                return message.ERROR_INVALID_ID
            else if (
                data.nome_fantasia == '' || data.nome_fantasia == undefined || data.nome_fantasia == null || data.nome_fantasia.length > 100 ||
                data.razao_social == '' || data.razao_social == undefined || data.razao_social == null || data.razao_social > 100 ||
                data.email == '' || data.email == undefined || data.email == null || data.email.length > 100 ||
                data.telefone == '' || data.telefone == undefined || data.telefone == null || data.telefone.length > 11 ||
                data.cnpj == '' || data.cnpj == undefined || data.cnpj == null || data.cnpj.length > 14 ||
                data.cep == '' || data.cep == undefined || data.cep == null || data.cep.length > 8 ||
                data.senha == '' || data.senha == undefined || data.senha == null || data.senha.length > 30 ||
                data.cpf_responsavel == '' || data.cpf_responsavel == undefined || data.cpf_responsavel == null || data.cpf_responsavel.length > 11 ||
                data.nome_responsavel == '' || data.nome_responsavel == undefined || data.nome_responsavel == null || data.nome_responsavel.length > 45 ||
                data.foto=='' || data.foto == undefined || data.foto == null || data.foto.length > 200
            )
                return message.ERROR_REQUIRED_FIELDS
            else{
                let client = await clienteDAO.selectClienteId(id)
                if(client.length>0){
                    let json = {}
                    let rtnDAO = await clienteDAO.updateClient(data, id)
                    if(rtnDAO){
                        json.cliente=data
                        json.status=message.SUCCESS_UPDATED_ITEM.status
                        json.status_code=message.SUCCESS_UPDATED_ITEM.status_code
                        json.message=message.SUCCESS_UPDATED_ITEM.message
                        return json
                    }
                    else{
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
                }
                else    
                    return message.ERROR_NOT_FOUND
            }
        }
        else
            return message.ERROR_CONTENT_TYPE
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER
    }
}

const deleteClient = async function(id){
    try {
        if(id==''||id==undefined||id==null||isNaN(id))
                return message.ERROR_INVALID_ID
        else{
            let client = await clienteDAO.selectClienteId(id)
            if(client.length>0){
                let rsDAO = await clienteDAO.deleteClient(id)
                if(rsDAO)
                    return message.SUCCESS_DELETED_ITEM
                else
                    return message.ERROR_INTERNAL_SERVER_DB
            }
            else
                return message.ERROR_NOT_FOUND
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER
    }
}

const getClient = async function(){
    try {
        let dados = await clienteDAO.selectClient()
        let json = {}
        if (dados) 
        {
            json.cliente = dados
            json.status = message.SUCCESS_CREATED_ITEM.status
            json.status_code = message.SUCCESS_CREATED_ITEM.status_code
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

const getClientId = async function(id){
    try {
        let idU = id
        if (idU == '' || idU == null || isNaN(idU) || idU == undefined) 
        {
            return message.ERROR_INVALID_ID
        }
        else
        {
            let json = {}
            let rtnClient = await clienteDAO.selectClienteId(idU)
            if (rtnClient) 
            {
                if (rtnClient.length > 0) 
                {
                    const element = rtnClient[0]
                    json.cliente = element
                    json.status = message.SUCCESS_CREATED_ITEM.status
                    json.status_code = message.SUCCESS_CREATED_ITEM.status_code
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

const callClientLogin = async function(data, contentType){
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
                let rtnClient = await clienteDAO.callLogin(emailU, password)
                console.log(rtnClient);
                
                if (rtnClient) 
                    {
                    if (rtnClient.length > 0) 
                    {
                        let id = rtnClient[0].f0
                        let json = {}
                        json.cliente = {id}
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
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports = {
    getClient,
    postClient,
    deleteClient,
    putClient,
    getClientId,
    callClientLogin
}