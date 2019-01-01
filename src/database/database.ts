import * as mysql from 'mysql';
import * as credentials from '../credentials';

export const createConnection = function() {
    return mysql.createConnection(credentials.mysqlConfig);
};

export const query = function(conn, sql): Promise<any> {
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
};

export const endConnection = function (conn) {
    conn.end();
};

export const queryOne = async function (sql) {
    const conn = createConnection();
    const results = await query(conn, sql);
    endConnection(conn);
    return results;
};
