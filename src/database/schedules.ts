import * as database from "./database";
import * as createError from "http-errors";
import { convertToSchedule, Schedule, ScheduleResult } from "../models/schedule";

export const insertSchedule = async function (thumbId: number, timeout: number, condition: string, value: string) {
    const conn = database.createConnection();

    const sql =
        `INSERT INTO Schedules (thumb_id, timeout, \`condition\`, \`value\`) ` +
        `VALUES (${thumbId}, ${timeout}, '${condition}', '${value}')`;
    const result = await database.query(conn, sql);

    database.endConnection(conn);

    return await getSchedule(thumbId, condition);
};

export const getAllScheduleList = async function () {
    const sql = "SELECT * FROM Schedules";
    const scheduleResult: Array<ScheduleResult> = await database.queryOne(sql);

    let scheduleList: Array<Schedule> = [];
    for (let i = 0; i < scheduleResult.length; i++) {
        scheduleList.push(await convertToSchedule(scheduleResult[i]));
    }
    return scheduleList;
};

export const getScheduleList = async function (thumbId: number) {
    const sql = "SELECT * FROM Schedules WHERE thumb_id = ${thumbId}";
    const scheduleResult: Array<ScheduleResult> = await database.queryOne(sql);

    let scheduleList: Array<Schedule> = [];
    for (let i = 0; i < scheduleResult.length; i++) {
        scheduleList.push(await convertToSchedule(scheduleResult[i]));
    }
    return scheduleList;
};

export const getSchedule = async function (thumbId: number, condition: string) {
    const sql = `SELECT * FROM Schedules WHERE thumb_id = ${thumbId} && \`condition\` LIKE '${condition}'`;
    const scheduleResult: Array<ScheduleResult> = await database.queryOne(sql);

    if (scheduleResult.length == 0) {
        throw createError(400, `There is no schedule with thumbId is ${thumbId} and condition is ${condition}`);
    }

    return await convertToSchedule(scheduleResult[0]);
};

export const deleteSchedule = async function (thumbId: number, condition: string) {
    const sql = `DELETE FROM Schedules WHERE thumb_id = ${thumbId} && \`condition\` LIKE '${condition}'`;
    return await database.queryOne(sql);
};