var mysql=require('mysql')
var pool=mysql.createPool({
    host:"localhost",
    port:3306,
    user:"root",
    database:"stock_management",
    password:"12345",
    connectionLimit:100,
    multipleStatements:true
})

module.exports=pool