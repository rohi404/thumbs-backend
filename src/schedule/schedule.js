const database = require('../database/database.js');
const conditionRouter = require('../condition/condition-router');

const timeoutQueue = [];
const scheduleQueue = [];

function currentMillis() {
    return new Date().getTime();
}

class Schedule {
    constructor(thumbId, timeout, conditionName, changedValue) {
        this.thumbId = thumbId;
        this.timeout = timeout;
        this.condition = conditionName;
        this.value = changedValue;
    }
}

exports.loadQueue = async function () {
    const sql = 'SELECT * FROM Schedules';

    const results = await database.queryOne(sql);

    for (let i = 0; i < results.length; i++) {
        const schedule = new Schedule(results[i]['thumb_id'], results[i]['timeout'], results[i]['condition'], results[i]['value']);
        const delayMillis = schedule.timeout - currentMillis();
        const timeout = setTimeout(timeoutFunction, delayMillis, schedule);

        scheduleQueue.push(schedule);
        timeoutQueue.push(timeout);
    }
};

exports.refresh = async function (thumbId, condition, changedValue) {
    const index = scheduleQueue.findIndex(function(schedule) {
        const sameThumbId = parseInt(schedule.thumbId) === thumbId;
        const sameCondition = schedule.condition === condition;

        return sameThumbId && sameCondition;
    });

    let schedule = null;

    if (index === -1) {
        schedule = new Schedule(thumbId, -1, condition, -1);
    } else {
        schedule = scheduleQueue[index];
        const timeout = timeoutQueue[index];

        scheduleQueue.splice(index, 1);
        timeoutQueue.splice(index, 1);

        clearTimeout(timeout);
    }

    const result = await conditionRouter.determineScheduleDelayMillis(condition, changedValue);

    schedule.timeout = result[0];
    schedule.value = result[1];

    await exports.put(schedule);
};

exports.put = async function (schedule) {
    const sql =
        `INSERT INTO Schedules (thumb_id, timeout, \`condition\`, \`value\`) ` +
        `VALUES (${schedule.thumbId}, ${schedule.timeout}, '${schedule.condition}', ${schedule.value})`;

    const success = await database.queryOne(sql); // TODO error handling
    const delayMillis = schedule.timeout - currentMillis();
    const timeout = setTimeout(timeoutFunction, delayMillis, schedule);

    timeoutQueue.push(timeout);
    scheduleQueue.push(schedule);
};

function timeoutFunction(schedule) {
    console.log(schedule);

    const sql =
        `DELETE FROM Schedules WHERE ` +
        `thumb_id = ${schedule.thumbId} && ` +
        `\`condition\` = '${schedule.condition}'`;

    const sql2 = `UPDATE Thumbs SET ${schedule.condition}=${schedule.value} WHERE thumb_id=${schedule.thumbId}`;

    database.queryOne(sql)
        .then(database.queryOne(sql2))
        .then((success) => {
            console.log('Done')
        })
        .catch((error) => {
            console.error(error);
        })
}