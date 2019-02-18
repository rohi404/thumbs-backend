import * as database from "../database/database";
import * as schedule from "./schedule";
import { getThumb } from "../database/thumbs";
import { extractEventHandleFunc, extractImageFunc, extractLabelFunc } from "./policy";
import { Thumb } from "../models/thumbs";


export const handleEvent = async function (thumbId, event) {
    const thumb: Thumb = await getThumb(thumbId);

    const getNextValue = await extractEventHandleFunc(event["event"]);
    const valueToLabel = await extractLabelFunc();
    const getNextImage = await extractImageFunc();

    let queryList = [];
    const conditionList = ["affection", "health", "hygiene", "satiety"];
    for (let i in conditionList) {
        const condition = conditionList[i];
        const nowValue = parseInt(thumb.condition[condition].value);
        const nextValue = getNextValue(condition, nowValue);

        if (nextValue != null) {
            thumb.condition[condition].value = String(nextValue);
            thumb.condition[condition].label = valueToLabel(condition, nextValue);
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

    let lowList = {};
    for(let i in conditionList) {
        const condition = conditionList[i];
        if(thumb.condition[condition].label === 'low'){
            lowList[condition] = thumb.condition[condition].value;
        }
    }

    let min_condition = "";
    let min = 50;
    if(Object.keys(lowList).length != 0) {
        for (let i in lowList) {
            if (lowList[i] < min) {
                min = lowList[i];
                min_condition = i;
            }
        }

        thumb.image = getNextImage(min_condition, "low");
        if (min == 0)
            thumb.image = getNextImage("dead", "dead");
    }

    else {
        if(thumb.disease != null){
            thumb.image = getNextImage(thumb.disease, null);
        }
        else
            thumb.image = getNextImage("affection", "normal");
    }

    const sql = `UPDATE Thumbs SET image = '${thumb.image}' WHERE thumb_id = ${thumbId}`;
    await database.queryOne(sql);

    return thumb;
};