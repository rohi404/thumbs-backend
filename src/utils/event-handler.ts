import * as database from '../database/database';
import * as schedule from './schedule';
import { getThumb } from "../database/thumbs";

export const handleEvent = async function (thumbId, event) {
    const conn = database.createConnection();

    const sql1 = `SELECT * FROM Thumbs WHERE thumb_id=${thumbId}`;
    const thumbs = await database.query(conn, sql1);
    if (thumbs.length !== 1) {
        throw new Error(`There is/are ${thumbs.length} thumbs whose id is '${thumbId}'`);
    }
    const thumb = thumbs[0];

    const eventName = event['event'];

    const sql2 = `SELECT * FROM PolicyHandleUserEvent WHERE event_name LIKE '${eventName}'`;
    const policies = await database.query(conn, sql2);
    const queryList = [];

    // Update thumb object value with policy
    for (let i = 0; i < policies.length; i++) {
        const policy = policies[i];

        const condition = policy['condition'];
        const start = policy['range_start'];
        const end = policy['range_end'];
        const funcString = policy['function'];

        const nowValue = thumb[condition];

        if (start <= nowValue && nowValue <= end) {
            const func = new Function('value', funcString);
            const nextValue = func(nowValue);
            thumb[condition] = nextValue;
            queryList.push(`${condition}=${nextValue}`);
        }
    }

    // Update Database Values
    if (queryList.length !== 0) {
        const sql3 = `UPDATE Thumbs SET ${queryList.join(', ')} WHERE thumb_id = ${thumbId}`;
        await database.query(conn, sql3); // TODO Error handling
    }

    // Update Schedules
    for (let i = 0; i < queryList.length; i++) {
        const condition = queryList[i].split('=')[0];
        const value = parseInt(queryList[i].split('=')[1]);

        await schedule.refresh(thumbId, condition, value);
    }

    return await getThumb(thumbId);
};