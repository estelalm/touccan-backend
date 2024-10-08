const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library');


const prisma = new PrismaClient()

const insertDifficulty = async function(data){
    try {
        let sql = `INSERT INTO tbl_dificuldade(dificuldade) VALUE
        (
            '${data.dificuldade}'
        )`

        let rs = await prisma.$executeRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error)
        return false
    }
}

const selectDifficulty = async function(){
    try {
        let sql = 'select * from tbl_dificuldade'
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const selectDifficultyId = async function(id){
    try {
        let sql = `SELECT * FROM tbl_dificuldade WHERE id = ${id}`
        let rs = await prisma.$queryRawUnsafe(sql)
        return rs
    } catch (error) {
        console.log(error);
        return false
    }
}

const lastID = async function(){
    try {
        let sql = `SELECT id FROM tbl_dificuldade ORDER BY id DESC LIMIT 1;`
        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
    
}
module.exports ={
    insertDifficulty,
    selectDifficulty,
    selectDifficultyId,
    lastID
}