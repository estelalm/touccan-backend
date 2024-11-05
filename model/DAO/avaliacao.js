const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library');

const prisma = new PrismaClient()

const insertRatingUser = async function(data) {
    try {
        let sql = `INSERT INTO tbl_avaliacao_usuario(avaliacao, id_usuario, id_cliente, id_bico) VALUES (
            ${data.avaliacao},
            ${data.id_usuario},
            ${data.id_cliente},
            ${data.id_bico}
            )`
        
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports={
    insertRatingUser
}