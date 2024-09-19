const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library');


const prisma = new PrismaClient()

const insertUser = async function(data){
    try {
        let sql = `INSERT INTO tbl_usuario(nome, cpf, telefone, cep, email, data_nascimento, senha) VALUES 
        (
            '${data.nome}',
            '${data.cpf}',
            '${data.telefone}',
            '${data.cep}',
            '${data.email}',
            '${data.data_nascimento}',
            '${data.senha}'
        )`

        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error)
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
        let sql = `SELECT * FROM tbl_usuario WHERE id = ${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
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
    selectUser,
    selectUserId,
    callLogin,
    lastID
}