import * as database from "../database/database";
import { extractScheduleFunc } from "./policy";
import Timeout = NodeJS.Timeout;
import { Schedule } from "../models/schedule";
import { insertSchedule, getAllScheduleList, deleteSchedule } from "../database/schedules";

const timeoutQueue: Array<Timeout> = [];
const scheduleQueue: Array<Schedule> = [];

function currentMillis(): number {
    return new Date().getTime();
}

export const loadQueue = async function () {
    const results: Array<Schedule> = await getAllScheduleList();

    for (let i = 0; i < results.length; i++) {
        const schedule: Schedule = results[i];
        const delayMillis = schedule.timeout - currentMillis();
        const timeout: Timeout = setTimeout(timeoutFunction, delayMillis, schedule);

        scheduleQueue.push(schedule);
        timeoutQueue.push(timeout);
    }
};

export const initialSchedule = async function (thumbId: number) {
    const calcDelayAndValue = await extractScheduleFunc();
    const result = calcDelayAndValue('satiety', 50);
    const timeout: number = currentMillis() + result[0];
    const value: number = result[1];

    await insertSchedule(thumbId, timeout, 'satiety', value);
    await insertSchedule(thumbId, timeout, 'affection', value);
    await insertSchedule(thumbId, timeout, 'hygiene', value);
    await insertSchedule(thumbId, timeout, 'health', value);

    await loadQueue();
};

export const update = async function (thumbId: number, condition: string, changedValue: number) {
    const index = scheduleQueue.findIndex(function (schedule: Schedule) {
        const sameThumbId = schedule.thumbId === thumbId;
        const sameCondition = schedule.condition === condition;

        return sameThumbId && sameCondition;
    });

    let schedule: Schedule = null;

    if (index === -1) {
        schedule = {
            thumbId: thumbId,
            timeout: -1,
            condition: condition,
            value: -1
        };
    } else {
        schedule = scheduleQueue[index];
        const timeout = timeoutQueue[index];

        scheduleQueue.splice(index, 1);
        timeoutQueue.splice(index, 1);

        clearTimeout(timeout);
        await deleteSchedule(schedule.thumbId, schedule.condition)
    }

    const calcDelayAndValue = await extractScheduleFunc();
    const result = calcDelayAndValue(condition, changedValue);

    if (result != null) {
        schedule.timeout = currentMillis() + result[0];
        schedule.value = result[1];
        await put(schedule);
    }
};

export const put = async function (schedule: Schedule) {
    await insertSchedule(schedule.thumbId, schedule.timeout, schedule.condition, schedule.value)

    const delayMillis = schedule.timeout - currentMillis();
    const timeout = setTimeout(timeoutFunction, delayMillis, schedule);

    timeoutQueue.push(timeout);
    scheduleQueue.push(schedule);
};

async function timeoutFunction(schedule: Schedule) {
    await deleteSchedule(schedule.thumbId, schedule.condition);

    const sql2 = `UPDATE Thumbs SET ${schedule.condition}=${schedule.value} WHERE thumb_id=${schedule.thumbId}`;
    await database.queryOne(sql2);

    console.log(`Schedule timeout! - ${JSON.stringify(schedule)}`);

    if (schedule.value != 0) {
        const calcDelayAndValue = await extractScheduleFunc();
        const result = calcDelayAndValue(schedule.condition, schedule.value);

        if (result != null) {
            schedule.timeout = currentMillis() + result[0];
            schedule.value = result[1];
            await put(schedule);
        }
    }

    else {

    }
}