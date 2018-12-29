const database = require('../database/database');

exports.valueToLabel = async function (condition, value) {
    const sql = `SELECT * FROM PolicyConditionLabel WHERE \`condition\` LIKE '${condition}'`;
    const policies = await database.queryOne(sql);

    for (let i = 0; i < policies.length; i++) {
        const policy = policies[i];

        const rangeStart = parseInt(policy['range_start']);
        const rangeEnd = parseInt(policy['range_end']);
        const label = policy['label'];

        if (rangeStart <= value && value <= rangeEnd) {
            return label;
        }
    }

    return null;
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
            const delayFunc = new Function("value", delayFuncStr);
            const valueFunc = new Function("value", valueFuncStr);

            const delayMillis = delayFunc(nowValue);
            const value = valueFunc(nowValue);

            return [delayMillis, value];
        }
    }

    return null;
};
