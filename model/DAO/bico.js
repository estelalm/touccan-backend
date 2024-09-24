const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library');

const prisma = new PrismaClient()

const insertBico = async function(data) {
    try {
        let sql=`INSERT INTO tbl_bico (titulo, descricao, horario_inicio, data_inicio, horario_limite, data_limite, salario, finalizado, id_dificuldade, id_categoria, id_cliente)
            VALUES (
                '${data.titulo}', 
                '${data.descricao}', 
                '${data.horario_inicio}', 
                '${data.data_inicio}', 
                '${data.horario_limite}', 
                '${data.data_limite}', 
                ${data.salario}, 
                0, 
                ${data.id_dificuldade}, 
                ${data.id_categoria}, 
                ${data.id_cliente}
            );`
    let rs=await prisma.$executeRawUnsafe(sql)
    return rs
    } catch (error) {
        console.error(error);
        return false
    }
}

const selectAllBicos = async function() {
    try {
        let sql=`SELECT * FROM tbl_bico`
        let rs=await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.error(error)
        return false
    }
}

const selectBicoId = async function(id) {
    try {
        let sql = `SELECT * FROM tbl_bico WHERE tbl_bico = ${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}
const lastID = async function(){
    try {
        let sql = `SELECT id FROM tbl_bico ORDER BY id DESC LIMIT 1;`
        let sqlID = await prisma.$queryRawUnsafe(sql)
        return sqlID
    } catch (error) {
        return false
    }
    
}

module.exports={
    insertBico,
    selectAllBicos,
    selectBicoId,
    lastID
}
