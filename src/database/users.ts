import * as database from "./database";
import * as createError from "http-errors";
import { convertToUser, User, UserResult } from "../models/users";

export const createUser = async function (id: string, password: string) {
    const conn = database.createConnection();

    const sql1 = `INSERT INTO Users (id, pw) VALUES ('${id}', '${password}');`;
    const result = await database.query(conn, sql1);

    const sql2 = `SELECT LAST_INSERT_ID() AS user_id;`;
    const result2 = await database.query(conn, sql2);

    database.endConnection(conn);

    const userId = result2[0]["user_id"];
    return await getUser(userId);
};

export const getUser = async function (userId: number) {
    const sql = `SELECT * FROM Users WHERE user_id = ${userId}`;
    const userResult: Array<UserResult> = await database.queryOne(sql);

    if (userResult.length == 0) {
        throw createError(404, `There is no users with user Id is ${userId}`);
    }

    return await convertToUser(userResult[0]);
};

export const modifyUser = async function (userId: number, userPassword: string | undefined) {
    const queries = [];

    if (userPassword != undefined) {
        queries.push(`pw=\'${userPassword}\'`);
    }

    const sql = `UPDATE Users SET ${queries.join(", ")} WHERE user_id = ${userId};`;
    const result = await database.queryOne(sql);

    return await getUser(userId);
};

export const deleteUser = async function (userId: number) {
    const conn = database.createConnection();

    const sql1 = `DELETE FROM Users WHERE user_id = ${userId};`;
    const sql2= `DELETE FROM Thumbs WHERE user_id = ${userId};`;

    const result1 = await database.query(conn, sql1);
    const result2 = await database.query(conn, sql2);

    return result1;
};