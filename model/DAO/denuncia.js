const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library');
const e = require('express');

const prisma = new PrismaClient()

const insertReportUser = async function(data) {
    try {
        let sql = `INSERT INTO tbl_denuncia_usuario(denuncia, id_usuario, id_cliente, id_bico) VALUES (
            "${data.denuncia}",
            ${data.id_usuario},
            ${data.id_cliente},
            ${data.id_bico}
            );`
        console.log(sql);
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const insertReportClient = async function(data) {
    try {
        let sql = `INSERT INTO tbl_denuncia_cliente(denuncia, id_usuario, id_cliente, id_bico) VALUES (
            "${data.denuncia}",
            ${data.id_usuario},
            ${data.id_cliente},
            ${data.id_bico}
            );`
        console.log(sql);
        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const selectFeedbackUserReport = async function(id_usuario) {
    try {
        let sql = `select * from tbl_denuncia_cliente where id_usuario = ${id_usuario}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}
const selectFeedbackClientReport = async function(id_cliente) {
    try {
        let sql = `select * from tbl_denuncia_usuario where id_cliente = ${id_cliente}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        return false
    }
}

const selectReportUserByID = async function(id) {
    try {
        let sql = `SELECT * FROM tbl_denuncia_usuario WHERE id = ${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}
const selectReportClientByID = async function(id) {
    try {
        let sql = `SELECT * FROM tbl_denuncia_cliente WHERE id = ${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const lastIDReportUser = async function(){
    try {
        let sql = `SELECT id FROM tbl_denuncia_usuario ORDER BY id DESC LIMIT 1;`
        let sqlID = await prisma.$queryRawUnsafe(sql)
        return sqlID
    } catch (error) {
        return false
    }
}
const lastIDReportClient = async function(){
    try {
        let sql = `SELECT id FROM tbl_denuncia_cliente ORDER BY id DESC LIMIT 1;`
        let sqlID = await prisma.$queryRawUnsafe(sql)
        return sqlID
    } catch (error) {
        return false
    }
}
module.exports={
    insertReportUser,
    selectReportUserByID,
    lastIDReportUser,
    insertReportClient,
    selectReportClientByID,
    lastIDReportClient,
    selectFeedbackUserReport,
    selectFeedbackClientReport
}