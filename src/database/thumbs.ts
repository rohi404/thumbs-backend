import * as database from "./database";
import * as createError from "http-errors";
import { convert, Thumb, ThumbResult } from "../models/thumbs";

export const createThumb = async function (userId: number, name: string) {
    const conn = database.createConnection();

    const sql1 = `INSERT INTO Thumbs (user_id, name) VALUES ('${userId}', '${name}');`;
    const result1 = await database.query(conn, sql1);

    const sql2 = `SELECT LAST_INSERT_ID() AS thumb_id;`;
    const result2 = await database.query(conn, sql2);

    database.endConnection(conn);

    const thumbId = result2[0]["thumb_id"];
    return await getThumb(thumbId);
};

export const getThumbList = async function (userId: number) {
    const sql = `SELECT * FROM Thumbs WHERE user_id = ${userId}`;
    const thumbResult: Array<ThumbResult> = await database.queryOne(sql);

    let thumbList: Array<Thumb> = [];
    for (let i = 0; i < thumbResult.length; i++) {
        thumbList.push(await convert(thumbResult[i]));
    }
    return thumbList;
};

export const getThumb = async function (thumbId: number) {
    const sql = `SELECT * FROM Thumbs WHERE thumb_id = ${thumbId}`;
    const thumbResult: Array<ThumbResult> = await database.queryOne(sql);

    if (thumbResult.length == 0) {
        throw createError(400, `There is no thumbs with thumbId is ${thumbId}`);
    }

    return await convert(thumbResult[0]);
};

export const modifyThumb = async function (thumbId: number, name: string | undefined) {
    const queries = [];

    if (name != undefined) {
        queries.push(`name=\'${name}\'`);
    }

    const sql = `UPDATE Thumbs SET ${queries.join(", ")} WHERE thumb_id = ${thumbId};`;
    const result = await database.queryOne(sql);

    return await getThumb(thumbId);
};

export const deleteThumb = async function (thumbId: number) {
    const sql = `DELETE FROM Thumbs WHERE thumb_id = ${thumbId};`;
    return await database.queryOne(sql);
};