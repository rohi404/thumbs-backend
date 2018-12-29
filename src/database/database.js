const mysql = require('mysql');
const credentials = require('../../credentials.js');

function createConnection() {
    return mysql.createConnection(credentials.mysqlConfig);
}

function query(conn, sql) {
    return new Promise(function (resolve, reject) {
        conn.query(sql, [], function (err, results, fields) {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function endConnection(conn) {
    conn.end();
}

exports.queryOne = async function (sql) {
    const conn = createConnection();
    const results = await query(conn, sql);
    endConnection(conn);
    return results;
};

exports.createConnection = createConnection;
exports.query = query;
exports.endConnection = endConnection;
