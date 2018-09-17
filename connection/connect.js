var sql = require("mssql");
var connect = function()
{
    var conn = new sql.ConnectionPool({
        
        server: '192.168.1.128',
        database: 'TestDB',
        user:'sa',
        password:'mediassist'
    });
    return conn;
};  

module.exports = connect;