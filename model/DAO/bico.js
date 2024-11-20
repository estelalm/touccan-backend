const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library');

const prisma = new PrismaClient()

const finalizarClient = async function (data) {
    try {
        let sql = `UPDATE tbl_bico SET 
                    final_c = ${data.final}
                    WHERE tbl_bico.id = ${data.id} `
        let rs=await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}

const finalizarUser = async function (data) {
    try {
        let sql = `UPDATE tbl_bico SET 
                    final_u = ${data.final}
                    WHERE tbl_bico.id = ${data.id} `
        let rs=await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}

const insertBico = async function(data) {
    try {
        let sql=`INSERT INTO tbl_bico (titulo, descricao, horario_inicio, data_inicio, horario_limite, data_limite, salario, final_c, final_u, finalizado, id_dificuldade, id_categoria, id_cliente)
            VALUES (
                '${data.titulo}', 
                '${data.descricao}', 
                '${data.horario_inicio}', 
                '${data.data_inicio}', 
                '${data.horario_limite}', 
                '${data.data_limite}', 
                ${data.salario}, 
                0,
                0,
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

const confirmCandidate = async function(data) {
    try {
        let sql=`
            UPDATE tbl_usuario_bico

            SET
                escolhido=1

            WHERE id_usuario=${data.id_user}
            AND id_bico=${data.id_bico};
        `
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.error(error);
        return false
    }
}

const deleteCandidate = async function(data) {
    try {
        let sql=`DELETE FROM tbl_usuario_bico WHERE id_usuario=${data.id_user} AND id_bico=${data.id_bico}`
        let rs = await prisma.$executeRawUnsafe(sql)
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

const selectBicoPendent = async function (id) {
    try {
        let sql = `SELECT * FROM tbl_bico WHERE tbl_bico.id_cliente = ${id} AND finalizado=0 ORDER BY id DESC`
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

const selectBicoByCandidate = async function(id){
    try {
        let sql=`SELECT b.id as "id_bico", b.titulo AS "bico", b.descricao, b.horario_inicio, b.horario_limite, b.data_inicio, b.data_limite, b.salario, b.finalizado, c.nome_fantasia AS "nome_cliente", u.nome AS "nome_usuario" FROM tbl_usuario_bico AS i
                 JOIN tbl_usuario AS u ON u.id = i.id_usuario
                 JOIN tbl_bico AS b ON b.id = i.id_bico
                 JOIN tbl_cliente AS c on c.id=b.id_cliente
                 WHERE u.id=${id};`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.error(error);
        return false
    }
}

const selectBicoClientPremium = async function(){
    try {
        let sql = 'SELECT tbl_bico.id as id_bico, tbl_bico.* FROM tbl_bico JOIN tbl_cliente on tbl_cliente.id = tbl_bico.id_cliente WHERE tbl_cliente.premium = 1 ORDER BY tbl_bico.id DESC;'
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        return error        
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
        let sql = `SELECT b.titulo AS "bico", u.nome AS "candidato", u.foto, c.escolhido, b.id AS "id_bico", u.id AS "id_candidato" FROM tbl_usuario_bico AS c
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

const selectCandidatesByAceitos = async(id) => {
    try {
        let sql = `SELECT tbl_bico.titulo AS "bico", tbl_usuario.nome AS "candidato", tbl_usuario_bico.escolhido, tbl_bico.id as "id_bico", tbl_usuario.id "id_canditado" FROM tbl_usuario_bico
                 JOIN tbl_bico  ON tbl_usuario_bico.id_bico=tbl_bico.id
                 JOIN tbl_usuario ON tbl_usuario_bico.id_usuario=tbl_usuario.id
                 WHERE tbl_bico.id=${id} AND tbl_usuario_bico.escolhido = 1;`
        console.log(sql);

        
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
    confirmCandidate,
    deleteCandidate,
    selectBicoByID,
    selectAllBicos,
    selectBicoPendent,
    selectBicoByFilter,
    lastID,
    deleteBico,
    selectBicoClientId,
    selectBicoByCandidate,
    selectAllCandidates,
    selectCandidatesByBicoID,
    selectBicoClientPremium,
    finalizarClient,
    finalizarUser,
    selectCandidatesByAceitos
}