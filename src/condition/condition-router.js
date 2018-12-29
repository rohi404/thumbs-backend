const affection = require('./condition/affection');
const health = require('./condition/health');
const hygiene = require('./condition/hygiene');
const satiety = require('./condition/satiety');
const database = require('../database/database');

exports.valueToLabel = function (condition, value) {
    switch (condition) {
        case 'affection':
            return affection.valueToLabel(value);
        case 'health':
            return health.valueToLabel(value);
        case 'hygiene':
            return hygiene.valueToLabel(value);
        case 'satiety':
            return satiety.valueToLabel(value);
        default:
            return new Error('Unknown Condition Name');
    }
};

exports.determineScheduleDelayMillis = async function (condition, nowValue) {
    const sql = `SELECT * FROM PolicyConditionDecrement WHERE \`condition\` LIKE '${condition}'`;
    const policies = await database.queryOne(sql);

    for (let i = 0; i < policies.length; i++) {
        const policy = policies[i];

        const rangeStart = parseInt(policy['range_start']);
        const rangeEnd = parseInt(policy['range_end']);
        const delayFuncStr = policy['delay_func'];
        const valueFuncStr = policy['value_func'];

        if (rangeStart <= nowValue && nowValue <= rangeEnd) {
            console.log('rangeStart ' + rangeStart);
            console.log('rangeEnd ' + rangeEnd);
            console.log('asdf1');
            console.log('value ' + nowValue);
            console.log('asdf2');
            const delayFunc = new Function("value", delayFuncStr);
            const valueFunc = new Function("value", valueFuncStr);

            const delayMillis = delayFunc(nowValue);
            const value = valueFunc(nowValue);

            return [delayMillis, value];
        }
    }

    return null;
};
