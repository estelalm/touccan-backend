const message = require('./modulo/config.js')
const cartaoDAO = require('../model/DAO/cartao.js')

const postClientCard = async function(data, contentType) {
    try {
        if(String(contentType).toLowerCase()=='application/json'){
            let json={}
            if(
                data.numero.length!=16      || data.numero==null       || data.numero==''            || data.numero==undefined       || isNaN(data.numero) ||
                data.validade.length!=5     || data.validade==null     || data.validade==''          || data.validade==undefined     ||
                data.cvv.length!=3          || data.cvv==null          || data.cvv==''               || data.cvv==undefined          || isNaN(data.cvv)    ||
                data.nome_titular.length>40 || data.nome_titular==null || data.nome_titular==''      || data.nome_titular==undefined ||
                data.cpf.length!=11         || data.cpf==null          || data.cpf==''               || data.cpf==undefined          || isNaN(data.cpf)    ||
                data.id_cliente==null       || data.id_cliente==''     || data.id_cliente==undefined || isNaN(data.id_cliente)                            
            )
                return message.ERROR_REQUIRED_FIELDS
            else{
                let validateStatus=false
                if(data.apelido!=null&&data.apelido!=''&&data.apelido!=undefined){
                    if(data.apelido.length>45)
                        return message.ERROR_REQUIRED_FIELDS
                    else
                        validateStatus=true
                }
                else
                    validateStatus=true
                if(validateStatus){
                    let rtnDAO=await cartaoDAO.insertClientCard(data)
                    if(rtnDAO){
                        json.cartao=data
                        json.status=message.SUCCESS_CREATED_ITEM.status
                        json.status_code=message.SUCCESS_CREATED_ITEM.status_code
                        json.message=message.SUCCESS_CREATED_ITEM.message
                        return json
                    }
                    else
                        return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        }
        else
            return message.ERROR_CONTENT_TYPE
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER
    }
}

module.exports={
    postClientCard
}