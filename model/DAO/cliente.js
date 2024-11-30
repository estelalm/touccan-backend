const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library');
//const fetch = require('node-fetch');


const prisma = new PrismaClient()

const insertClient = async function(data, id_end){
    try {
        let sql = `INSERT INTO tbl_cliente(nome_fantasia, razao_social, email, telefone, cnpj, cep, senha, cpf_responsavel, nome_responsavel, foto, id_endereco) VALUES 
        (
            '${data.nome_fantasia}',
            '${data.razao_social}',
            '${data.email}',
            '${data.telefone}',
            '${data.cnpj}',
            '${data.cep}',
            '${data.senha}',
            '${data.cpf_responsavel}',
            '${data.nome_responsavel}',
            "https://pin.it/1GpCbflTW",
            ${id_end}
        )`

        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error)
        return false
    }
}

const insertEndereco = async function(endereco) {
    try {
        let sql = `INSERT INTO tbl_endereco(rua, bairro, cidade, estado) VALUES (
        '${endereco.logradouro}',
        '${endereco.bairro}',
        '${endereco.localidade}',
        '${endereco.uf}'
        )`

        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
      } catch (error) {
        console.error("Erro no backend:", error);
        return false
      }
}

const updateClientPremium = async function(premium, id){
    try {
        let sql = `UPDATE tbl_cliente SET 
                    premium = ${premium}
                    WHERE id = ${id}`
        
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}

const updateClient = async function(data, id) {
    try {
        let sql=`
            UPDATE tbl_cliente 
            SET
                nome_responsavel='${data.nome_responsavel}',
                nome_fantasia='${data.nome_fantasia}',
                telefone=${data.telefone},
                cep=${data.cep},
                senha='${data.senha}',
                foto='${data.foto}'

            WHERE id='${id}';
        `
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const updateEndereco = async function (id, endereco) {
    try {
        let sql = `
        UPDATE tbl_endereco SET
        rua = '${endereco.logradouro}',
        bairro ='${endereco.bairro}',
        cidade = '${endereco.localidade}',
        estado = '${endereco.uf}'

        WHERE id = ${id}
        `        
        console.log(sql);
        
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}

const updateClientPassword = async function(data, id) {
    try {
        let sql=`
            UPDATE tbl_cliente 

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

const deleteClient = async function(id){
    try {
        let sql
        let rsI = await prisma.$transaction([
            prisma.$executeRawUnsafe(`
                DELETE FROM tbl_avaliacao_cliente WHERE id_cliente=${id}
            `),
            prisma.$executeRawUnsafe(`
                DELETE FROM tbl_avaliacao_usuario WHERE id_cliente=${id}
            `),
            prisma.$executeRawUnsafe(`
                DELETE FROM tbl_cartao_cliente WHERE id_cliente=${id}
            `),
            prisma.$executeRawUnsafe(`
                DELETE FROM tbl_bico WHERE id_cliente=${id}
            `),
            prisma.$executeRawUnsafe(`
                DELETE FROM tbl_cliente_bico WHERE id_cliente=${id}
            `),
            prisma.$executeRawUnsafe(`
                DELETE FROM tbl_denuncia_cliente WHERE id_cliente=${id}
            `),
            prisma.$executeRawUnsafe(`
                DELETE FROM tbl_denuncia_usuario WHERE id_cliente=${id}
            `)
        ])
        if(rsI){
            sql=`DELETE  FROM tbl_cliente WHERE id='${id}';`
            let rs = await prisma.$executeRawUnsafe(sql)    
            return rs
        }
        else
            return false
    } catch (error) {
        console.error(error);
        return false
    }
}

const selectClient = async function(){
    try {
        let sql = 'select * from tbl_cliente'
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const selectClienteId = async function(id){
    try {
        let sql = `SELECT * FROM tbl_cliente WHERE id = ${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const selectClientRelations = async function(id) {
    try {
        let sql = `SELECT u.nome AS "nome_usuario", u.foto AS "foto_usuario", u.id AS "id_usuario" FROM tbl_usuario_bico AS c
                   JOIN tbl_bico AS b ON c.id_bico=b.id
                   JOIN tbl_usuario AS u ON c.id_usuario=u.id
                   JOIN tbl_cliente AS cl ON b.id_cliente=cl.id
                   WHERE c.escolhido = 1 AND cl.id=${id};`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error){
        console.log(error);
        return false
    }
}

const selectClientForReturnBico = async function(id) {
    try {
        let sql = `SELECT id, nome_fantasia, cep, id_endereco FROM tbl_cliente WHERE id = ${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const updateClientInfos = async function(id, data){
    try {
        let sql = `UPDATE tbl_cliente SET
        email='${data.email}',
        nome_fantasia='${data.nome_fantasia}',
        telefone=${data.telefone},
        cep=${data.cep}
        WHERE id = ${id}`
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}

const callLogin = async function(email, pw){
    try {
        let sql = `CALL sp_login_cliente('${email}', '${pw}');`        
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}

const lastID = async function(){
    try {
        let sql = `SELECT id FROM tbl_cliente ORDER BY id DESC LIMIT 1;`
        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
    
}

const lastIDE = async function(){
    try {
        let sql = `SELECT id FROM tbl_endereco ORDER BY id DESC LIMIT 1;`
        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
    
}

const selectEnderecoId = async function(id){
    try {
        let sql = `SELECT * FROM tbl_endereco WHERE id = ${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}
const selectHistoricoCliente = async function (id) {
    try {
        let sql = `select tbl_usuario.id, tbl_usuario.nome, tbl_usuario.foto, tbl_bico.id as "id_bico", tbl_bico.descricao,tbl_bico.titulo, tbl_bico.salario, tbl_bico.data_limite, tbl_bico.horario_limite, tbl_bico.data_inicio, tbl_bico.finalizado, tbl_bico.horario_inicio from tbl_bico
        join tbl_usuario_bico on tbl_bico.id = tbl_usuario_bico.id_bico
        join tbl_usuario on tbl_usuario_bico.id_usuario = tbl_usuario.id
        where tbl_bico.id_cliente = ${id};`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs

   } catch (error) {
        return false
    }
}
module.exports ={
    insertClient,
    updateClientPremium,
    updateClient,
    updateClientPassword,
    selectClient,
    deleteClient,
    selectClienteId,
    selectClientForReturnBico,
    updateClientInfos,
    callLogin,
    lastID,
    insertEndereco,
    lastIDE,
    selectClientRelations,
    selectEnderecoId,
    updateEndereco,
    selectHistoricoCliente
}