const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library');
const e = require('express');

const prisma = new PrismaClient()

const insertRatingUser = async function(data) {
    try {
        let sql = `INSERT INTO tbl_avaliacao_usuario(avaliacao, id_usuario, id_cliente, id_bico, nota) VALUES (
            "${data.avaliacao}",
            ${data.id_usuario},
            ${data.id_cliente},
            ${data.id_bico},
            ${data.nota}
            );`
        console.log(sql);
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.error(error);
        return error
    }
}

const insertRatingClient = async function(data) {
    try {
        let sql = `INSERT INTO tbl_avaliacao_cliente(avaliacao, id_usuario, id_cliente, id_bico, nota) VALUES (
            "${data.avaliacao}",
            ${data.id_usuario},
            ${data.id_cliente},
            ${data.id_bico},
            ${data.nota}
            );`
        console.log(sql);
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.error(error);
        return error
    }
}

const selectFeedbackUserRating = async function(id_usuario) {
    try {
        let sql = `select * from tbl_avaliacao_cliente where id_usuario = ${id_usuario}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}
const selectFeedbackClientRating = async function(id_cliente) {
    try {
        let sql = `select * from tbl_avaliacao_usuario where id_cliente = ${id_cliente}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}

const selectRatingUserByID = async function(id) {
    try {
        let sql = `SELECT * FROM tbl_avaliacao_usuario WHERE id = ${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}
const selectRatingClientByID = async function(id) {
    try {
        let sql = `SELECT * FROM tbl_avaliacao_cliente WHERE id = ${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const lastIDRatingUser = async function(){
    try {
        let sql = `SELECT id FROM tbl_avaliacao_usuario ORDER BY id DESC LIMIT 1;`
        let sqlID = await prisma.$queryRawUnsafe(sql)
        return sqlID
    } catch (error) {
        return false
    }
}
const lastIDRatingClient = async function(){
    try {
        let sql = `SELECT id FROM tbl_avaliacao_cliente ORDER BY id DESC LIMIT 1;`
        let sqlID = await prisma.$queryRawUnsafe(sql)
        return sqlID
    } catch (error) {
        return false
    }
}
module.exports={
    insertRatingUser,
    selectRatingUserByID,
    lastIDRatingUser,
    insertRatingClient,
    selectRatingClientByID,
    lastIDRatingClient,
    selectFeedbackUserRating,
    selectFeedbackClientRating
}