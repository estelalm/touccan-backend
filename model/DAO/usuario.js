const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library');


const prisma = new PrismaClient()

const insertUser = async function(data){
    try {
        let sql = `INSERT INTO tbl_usuario(nome, cpf, telefone, cep, email, data_nascimento, senha, foto, formacao) VALUES 
        (
            '${data.nome}',
            '${data.cpf}',
            '${data.telefone}',
            '${data.cep}',
            '${data.email}',
            '${data.data_nascimento}',
            '${data.senha}',
            "https://pin.it/yLIpdh8u7",
            "Ainda não informada nenhuma formação!"
        )`

        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error)
        return false
    }
}

const updateUser = async function(data, id) {
    try {
        let sql=`
            UPDATE tbl_usuario

            SET
                nome='${data.nome}',
                telefone=${data.telefone},
                cep=${data.cep},
                cpf=${data.cpf},
                data_nascimento='${data.data_nascimento}',
                senha='${data.senha}',
                foto='${data.foto}',
                biografia='${data.biografia}',
                habilidade='${data.habilidade}',
                formacao='${data.formacao}',
                id_disponibilidade=${data.id_disponibilidade}

            WHERE id='${id}';
        `
        console.log(sql);
        
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const updateUserPassword = async function(data, id) {
    try {
        let sql=`
            UPDATE tbl_usuario

            SET
                senha='${data.senha}'

            WHERE id='${id}';
        `
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const updateUserInfos = async function(id, data){
    try {
        let sql = `UPDATE tbl_usuario SET
        nome='${data.nome_responsavel}',
        telefone=${data.telefone},
        cep=${data.cep},
        email='${data.email}'
        WHERE id = ${id}`
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}

const selectUser = async function(){
    try {
        let sql = 'select * from tbl_usuario'
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const selectUserId = async function(id){
    try {
        let sql = `SELECT * FROM tbl_usuario WHERE tbl_usuario.id = ${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const selectUserRelations = async function(id) {
    try {
        let sql = `SELECT cl.nome_fantasia AS "nome_cliente", cl.foto AS "foto_cliente", cl.id AS "id_cliente" FROM tbl_usuario_bico AS c
                   JOIN tbl_bico AS b ON c.id_bico=b.id
                   JOIN tbl_usuario AS u ON c.id_usuario=u.id
                   JOIN tbl_cliente AS cl ON b.id_cliente=cl.id
                   WHERE c.escolhido = 1 AND u.id = ${id};`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error){
        console.log(error);
        return false
    }
}

const callLogin = async function(email, pw){
    try {
        let sql = `CALL sp_login_usuario('${email}', '${pw}');`        
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}


const lastID = async function(){
    try {
        let sql = `SELECT id FROM tbl_usuario ORDER BY id DESC LIMIT 1;`
        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
    
}

module.exports = {
    insertUser,
    updateUser,
    updateUserPassword,
    updateUserInfos,
    selectUser,
    selectUserId,
    selectUserRelations,
    callLogin,
    lastID
}