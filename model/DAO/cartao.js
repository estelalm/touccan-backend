const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library');

const prisma = new PrismaClient()

const insertClientCard = async function(data) {
    try {
        let sql
        if(data.apelido!=''&&data.apelido!=null&&data.apelido!=undefined){
            sql=`INSERT INTO tbl_cartao_cliente(numero, validade, cvv, nome_titular, cpf, apelido, id_cliente)
            VALUES(
                '${data.numero}',
                '${data.validade}',
                '${data.cvv}',
                '${data.nome_titular}',
                '${data.cpf}',
                '${data.apelido}',
                '${data.id_cliente}'
            )`
            let rs=await prisma.$executeRawUnsafe(sql)
            return rs
        }
        else{
            sql=`INSERT INTO tbl_cartao_cliente(numero, validade, cvv, nome_titular, cpf, id_cliente, apelido)
            VALUES(
                '${data.numero}',
                '${data.validade}',
                '${data.cvv}',
                '${data.nome_titular}',
                '${data.cpf}',
                '${data.id_cliente}',
                null
            )`
            let rs=await prisma.$executeRawUnsafe(sql)
            return rs
        }
    } catch (error) {
        console.error(error);
        return false
    }
}

const updateClientCard = async function(data, id) {
    try {
        let sql
        if(data.apelido==''||data.apelido==null||data.apelido==undefined){
            sql=`
            UPDATE tbl_cartao_cliente

            SET
                numero='${data.numero}',
                validade='${data.validade}',
                cvv='${data.cvv}',
                nome_titular='${data.nome_titular}',
                cpf='${data.cpf}',
                apelido=null

            WHERE id_cliente='${id}';
        `
        }
        else{
            sql=`
            UPDATE tbl_cartao_cliente

            SET
                numero='${data.numero}',
                validade='${data.validade}',
                cvv='${data.cvv}',
                nome_titular='${data.nome_titular}',
                cpf='${data.cpf}',
                apelido='${data.apelido}'

            WHERE id_cliente='${id}';
        `
        }
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const selectClientCard = async function(id) {
    try {
        let sql = `SELECT * from tbl_cartao_cliente WHERE id_cliente = ${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        return error
    }
}

const insertUserCard = async function(data) {
    try {
        let sql
        if(data.apelido!=''&&data.apelido!=null&&data.apelido!=undefined){
            sql=`INSERT INTO tbl_cartao_usuario(numero, validade, cvv, nome_titular, cpf, apelido, id_usuario)
            VALUES(
                '${data.numero}',
                '${data.validade}',
                '${data.cvv}',
                '${data.nome_titular}',
                '${data.cpf}',
                '${data.apelido}',
                '${data.id_usuario}'
            )`
            let rs=await prisma.$executeRawUnsafe(sql)
            return rs
        }
        else{
            sql=`INSERT INTO tbl_cartao_usuario(numero, validade, cvv, nome_titular, cpf, id_cliente, apelido)
            VALUES(
                '${data.numero}',
                '${data.validade}',
                '${data.cvv}',
                '${data.nome_titular}',
                '${data.cpf}',
                '${data.id_usuario}',
                null
            )`
            let rs=await prisma.$executeRawUnsafe(sql)
            return rs
        }
    } catch (error) {
        console.error(error);
        return false
    }
}

const updateUserCard = async function(data, id) {
    try {
        let sql
        if(data.apelido==''||data.apelido==null||data.apelido==undefined){
            sql=`
            UPDATE tbl_cartao_usuario

            SET
                numero='${data.numero}',
                validade='${data.validade}',
                cvv='${data.cvv}',
                nome_titular='${data.nome_titular}',
                cpf='${data.cpf}',
                apelido=null

            WHERE id_usuario='${id}';
        `
        }
        else{
            sql=`
            UPDATE tbl_cartao_usuario

            SET
                numero='${data.numero}',
                validade='${data.validade}',
                cvv='${data.cvv}',
                nome_titular='${data.nome_titular}',
                cpf='${data.cpf}',
                apelido='${data.apelido}'

            WHERE id_usuario='${id}';
        `
        }
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const selectUserCard = async function(id) {
    try {
        let sql = `SELECT * from tbl_cartao_usuario WHERE id_usuario = ${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        return error
    }
}

module.exports={
    insertClientCard,
    insertUserCard,
    selectClientCard,
    updateClientCard,
    updateUserCard,
    selectUserCard
}