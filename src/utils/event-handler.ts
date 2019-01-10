import * as database from "../database/database";
import * as schedule from "./schedule";
import { getThumb } from "../database/thumbs";
import { extractEventHandleFunc } from "./policy";
import { Thumb } from "../models/thumbs";


export const handleEvent = async function (thumbId, event) {
    const thumb: Thumb = await getThumb(thumbId);

    const getNextValue = await extractEventHandleFunc(event["event"]);

    let queryList = [];
    for (let condition in ["affection", "health", "hygiene", "satiety"]) {
        const nowValue = thumb.condition[condition];
        const nextValue = getNextValue(condition, nowValue);

        if (nextValue != null) {
            thumb.condition[condition] = nextValue;
            queryList.push(`${condition}=${nextValue}`);
        }
    }

    // Update Database Values
    if (queryList.length !== 0) {
        const sql = `UPDATE Thumbs SET ${queryList.join(", ")} WHERE thumb_id = ${thumbId}`;
        await database.queryOne(sql);
    }

    // Update Schedules
    for (let i = 0; i < queryList.length; i++) {
        const condition = queryList[i].split("=")[0];
        const nextValue = queryList[i].split("=")[1];
        await schedule.refresh(thumbId, condition, nextValue);
    }

    return thumb;
};