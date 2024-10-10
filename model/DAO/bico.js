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

const insertCandidate = async function(data){
    try {
        let sql=`INSERT INTO tbl_usuario_bico (id_usuario, id_bico, escolhido)
            VALUES (
                '${data.id_user}',
                '${data.id_bico}',
                0
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
        let sql=`SELECT * FROM tbl_bico ORDER BY id DESC`
        let rs=await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.error(error)
        return false
    }
}

const selectBicoByID = async function(id) {
    try {
        let sql = `SELECT * FROM tbl_bico WHERE id = ${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const selectBicoClientId = async function (id) {
    try {
        let sql = `SELECT * FROM tbl_bico WHERE tbl_bico.id_cliente = ${id} ORDER BY id DESC`
        console.log(sql)
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}

const selectBicoByFilter = async function(script){
    try {
        let sql = `SELECT * FROM tbl_bico ${script}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.error(error);
        return false
    }
}

const deleteBico = async (id) => {
    try {
        let sql = `delete from tbl_bico where id = ${id}`
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}

const selectAllCandidates = async() => {
    try {
        let sql = `SELECT b.titulo AS "bico", u.nome AS "candidato", c.escolhido, b.id AS "id_bico", u.id AS "id_candidato" FROM tbl_usuario_bico AS c
                 JOIN tbl_bico AS b ON c.id_bico=b.id
                 JOIN tbl_usuario AS u ON c.id_usuario=u.id;`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.error(error);
        return false
    }
}

const selectCandidatesByBicoID = async(id) => {
    try {
        let sql = `SELECT b.titulo AS "bico", u.nome AS "candidato", c.escolhido, b.id AS "id_bico", u.id AS "id_candidato" FROM tbl_usuario_bico AS c
                 JOIN tbl_bico AS b ON c.id_bico=b.id
                 JOIN tbl_usuario AS u ON c.id_usuario=u.id
                 WHERE b.id=${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.error(error);
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
    insertCandidate,
    selectBicoByID,
    selectAllBicos,
    selectBicoByFilter,
    lastID,
    deleteBico,
    selectBicoClientId,
    selectAllCandidates,
    selectCandidatesByBicoID
}