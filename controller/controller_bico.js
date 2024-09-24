const bicoDAO = require('../model/DAO/bico.js')
const categoriaDAO = require('../model/DAO/categoria.js')
const dificuldadeDAO = require('../model/DAO/dificuldade.js')
const clienteDAO = require('../model/DAO/cliente.js')
const message = require('./modulo/config.js')

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
                    json.bico = data
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
        console.error(error);
        return message.ERROR_INTERNAL_SERVER
    }
}

const getBicoId = async function(id){
    try {
        let idU = id
        if (idU == '' || idU == null || isNaN(idU) || idU == undefined) 
        {
            return message.ERROR_INVALID_ID
        }
        else
        {
            let json = {}
            let rtnBico  = await bicoDAO.selectBicoId(idU)
            if (rtnBico) 
            {
                if (rtnBico.length > 0) 
                {
                    let element = rtnBico[0]
                    let cat = await categoriaDAO.selectCategoryId(element.id_categoria)
                    element.categoria = cat
                    let ing = await ingredienteDAO.selectIngredienteByProduto(produto.id_produto)
                    produto.ingrediente = ing

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

module.exports={
    postBico,
    getBico
}