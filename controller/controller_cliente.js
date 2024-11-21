const clienteDAO = require('../model/DAO/cliente.js')
const message = require('./modulo/config.js')

const postClient = async function (data, contentType) {
    try {
        // Verifica se o content-type é JSON
        if (String(contentType).toLocaleLowerCase() !== 'application/json') {
            return message.ERROR_CONTENT_TYPE;
        }

        // Validações de campos obrigatórios
        if (
            !data.nome_fantasia || data.nome_fantasia.length > 100 ||
            !data.razao_social || data.razao_social.length > 100 ||
            !data.email || data.email.length > 100 ||
            !data.telefone || data.telefone.length > 11 ||
            !data.cnpj || data.cnpj.length > 14 ||
            !data.cep || data.cep.length !== 8 || isNaN(data.cep) || 
            !data.senha || data.senha.length > 30 ||
            !data.cpf_responsavel || data.cpf_responsavel.length > 11 ||
            !data.nome_responsavel || data.nome_responsavel.length > 45
        ) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        // Busca endereço no ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${data.cep}/json/`);
        if (!response.ok) throw new Error("Erro ao consultar ViaCEP");
        const endereco = await response.json();

        // Insere endereço no banco de dados
        const enderecoId = await clienteDAO.insertEndereco(endereco);
        if (!enderecoId) {
            return message.ERROR_INTERNAL_SERVER_DB;
        }
        let id = await clienteDAO.lastIDE()
        let idE = id[0].id
        // Insere cliente com o endereço recém-criado
        const clienteInserido = await clienteDAO.insertClient(data, idE);
        if (!clienteInserido) {
            return message.ERROR_INTERNAL_SERVER_DB;
        }
        let id_ = await clienteDAO.lastID()
        let idC = id_[0].id

        // Busca cliente e endereço para retorno
        const cliente = await clienteDAO.selectClienteId(idC);
        const enderecoCompleto = await clienteDAO.selectEnderecoId(idE);

        if (cliente && enderecoCompleto) {
            // Monta a resposta
            const resultado = {
                cliente: {
                    ...cliente[0],
                    endereco: enderecoCompleto,
                },
                status: message.SUCCESS_CREATED_ITEM.status,
                status_code: message.SUCCESS_CREATED_ITEM.status_code,
                message: message.SUCCESS_CREATED_ITEM.message,
            };
            console.log(resultado)
            return resultado;
        } else {
            return message.ERROR_INTERNAL_SERVER_DB;
        }
    } catch (error) {
        console.error("Erro ao processar requisição:", error);
        return message.ERROR_INTERNAL_SERVER;
    }
};


const putClientPremium = async function(id, data, contentType){
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            idC = id
            if (idC == '' || idC == undefined || idC == null || isNaN(idC)) {
                return message.ERROR_INVALID_ID
            } else if (data.premium !== 0 && data.premium !== 1) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let client = await clienteDAO.selectClienteId(idC)
                if(client){
                    let json = {}
                    let rtnDAO = await clienteDAO.updateClientPremium(data.premium, idC)
                    if(rtnDAO){
                        let cliente = await clienteDAO.selectClienteId(idC)
                        json.cliente=cliente
                        json.status=message.SUCCESS_UPDATED_ITEM.status
                        json.status_code=message.SUCCESS_UPDATED_ITEM.status_code
                        json.message=message.SUCCESS_UPDATED_ITEM.message
                        return json
                    }
                    else{
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
                }
                else{
                    return message.ERROR_NOT_FOUND
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}
const getEndereco = async function (id) {
    try {
        let idE = parseInt(id)
        if (idE === '' || idE === undefined || idE===null || isNaN(idE)) {
            return message.ERROR_INVALID_ID
        } else {
            let rtn = await clienteDAO.selectEnderecoId(idE)
            if (rtn) {
                let json = {
                    endereco: rtn,
                    status_code: 200
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
const getHistoricoCliente = async function (id) {
    try {
        let id_c = parseInt(id)
        console.log(id_c);
        if ( isNaN(id_c)) {
           return message.ERROR_INVALID_ID
        } else { 
            let his = await clienteDAO.selectHistoricoCliente(id_c)
            if (his) {
                let json = {}
                json.historico = his
                json.status_code = 200
                json.quantidade = his.length
                return json
            }else{
                return message.ERROR_INTERNAL_SERVER_DB
            }
            
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}
const putClient = async function (data, contentType, id) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return message.ERROR_CONTENT_TYPE;
        }
        if (!id || isNaN(id)) {
            return message.ERROR_INVALID_ID;
        }

        // Validação dos campos obrigatórios
        if (
            !data.nome_fantasia || data.nome_fantasia.length > 100 ||
            !data.telefone || data.telefone.length > 11 ||
            !data.cep || data.cep.length !== 8 ||
            !data.senha || data.senha.length > 30 ||
            !data.nome_responsavel || data.nome_responsavel.length > 45 ||
            !data.foto || data.foto.length > 200
        ) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        // Busca o cliente pelo ID
        const client = await clienteDAO.selectClienteId(id);
        if (client.length === 0) {
            return message.ERROR_NOT_FOUND;
        }

        // Realiza a requisição ao ViaCEP para obter os dados do endereço
        const endereco = await fetch(`https://viacep.com.br/ws/${data.cep}/json/`);
        if (!endereco.ok) {
            return message.ERROR_VIACEP_REQUEST_FAILED; // Caso a requisição falhe
        }

        const enderecoData = await endereco.json();
        if (enderecoData.erro) {
            return message.ERROR_INVALID_CEP; // Caso o CEP seja inválido
        }
        console.log(client[0].id_endereco);
        

        // Atualiza o endereço no banco de dados
        const enderecoAtualizado = await clienteDAO.updateEndereco(client[0].id_endereco, enderecoData);
        if (!enderecoAtualizado) {
            return message.ERROR_INTERNAL_SERVER_DB;
        }

        // Atualiza os dados do cliente
        const rtnDAO = await clienteDAO.updateClient(data, id);
        if (!rtnDAO) {
            return message.ERROR_INTERNAL_SERVER_DB;
        }

        // Retorna os dados atualizados do cliente e do endereço
        const updatedClient = await clienteDAO.selectClienteId(id);
        const updatedEndereco = await clienteDAO.selectEnderecoId(client[0].id_endereco);

        const json = {
            cliente: {
                ...updatedClient[0],  // Dados atualizados do cliente
                endereco: updatedEndereco,  // Endereço atualizado
            },
            status: message.SUCCESS_UPDATED_ITEM.status,
            status_code: message.SUCCESS_UPDATED_ITEM.status_code,
            message: message.SUCCESS_UPDATED_ITEM.message,
        };

        return json;

    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};


const putClientPassword = async function(data, contentType, id) {
    try {
        if(String(contentType).toLocaleLowerCase() == 'application/json'){
            if(id==''||id==undefined||id==null||isNaN(id))
                return message.ERROR_INVALID_ID
            else if (
                data.senha == '' || data.senha == undefined || data.senha == null || data.senha.length > 30
            )
                return message.ERROR_REQUIRED_FIELDS
            else{
                let client = await clienteDAO.selectClienteId(id)
                if(client.length>0){
                    let json = {}
                    let rtnDAO = await clienteDAO.updateClientPassword(data, id)
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

const putClientInfos = async function(data, contentType, id) {
    try {
        if(String(contentType).toLocaleLowerCase() == 'application/json'){
            if(id==''||id==undefined||id==null||isNaN(id))
                return message.ERROR_INVALID_ID
            else if (
                data.nome_fantasia == '' || data.nome_fantasia == undefined || data.nome_fantasia == null || data.nome_fantasia.length > 100 ||
                data.email == '' || data.email == undefined || data.email == null || data.email.length > 100 ||
                data.telefone == '' || data.telefone == undefined || data.telefone == null || data.telefone.length > 11 ||
                data.cep == '' || data.cep == undefined || data.cep == null || data.cep.length > 8 
            )
                return message.ERROR_REQUIRED_FIELDS
            else{
                let client = await clienteDAO.selectClienteId(id)
                if(client){
                    let json = {}
                    let rtnDAO = await clienteDAO.updateClientInfos(id, data)
                    console.log(rtnDAO)
                    if(rtnDAO){
                        let up = await clienteDAO.selectClienteId(id)
                        json.cliente = up
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
    putClientPremium,
    putClientPassword,
    putClientInfos,
    getClientId,
    callClientLogin,
    getHistoricoCliente,
    getEndereco
}