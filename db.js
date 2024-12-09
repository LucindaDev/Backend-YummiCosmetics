
const sql = require('mssql');

const sqlConfig = {
    user: 'lucindadev',
    password: 'cucurrucucu',
    database: 'YummiCosmetics',
    server: 'localhost',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(sqlConfig)
    .connect()
    .then(pool => {
        console.log('Conexión a SQL Server exitosa');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectar con SQL Server', err);
    });

module.exports = {
    sql, poolPromise
};