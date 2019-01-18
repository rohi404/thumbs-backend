import * as database from "../database/database";
import * as schedule from "./schedule";
import { getThumb } from "../database/thumbs";
import { extractEventHandleFunc } from "./policy";
import { Thumb } from "../models/thumbs";


export const handleEvent = async function (thumbId, event) {
    const thumb: Thumb = await getThumb(thumbId);

    const getNextValue = await extractEventHandleFunc(event["event"]);

    let queryList = [];
    const conditionList = ["affection", "health", "hygiene", "satiety"];
    for (let i in conditionList) {
        const condition = conditionList[i];
        const nowValue = parseInt(thumb.condition[condition].value);
        const nextValue = getNextValue(condition, nowValue);

        if (nextValue != null) {
            thumb.condition[condition].value = String(nextValue);
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
        await schedule.update(thumbId, condition, parseInt(nextValue));
    }

    return thumb;
};