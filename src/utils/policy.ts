import * as database from "../database/database";

export const extractLabelFunc = async function () {
    const sql = `SELECT * FROM PolicyConditionLabel`;
    const policies = await database.queryOne(sql);

    return (condition: string, value: number) => {
        for (let i = 0; i < policies.length; i++) {
            const policy = policies[i];

            const start = parseInt(policy["range_start"]);
            const end = parseInt(policy["range_end"]);

            if (condition == policy["condition"]) {
                if (start <= value && value <= end) {
                    return policy["label"];
                }
            }
        }

        return null;
    };
};

export const extractScheduleFunc = async function () {
    const sql = `SELECT * FROM PolicyConditionDecrement`;
    const policies = await database.queryOne(sql);

    return (condition: string, value: number) => {
        for (let i = 0; i < policies.length; i++) {
            const policy = policies[i];

            const start = parseInt(policy["range_start"]);
            const end = parseInt(policy["range_end"]);

            if (condition == policy["condition"]) {
                if (start < value && value <= end) {
                    const delayFunc = new Function("value", policy["delay_func"]);
                    const valueFunc = new Function("value", policy["value_func"]);

                    const delayMillis = delayFunc(value);
                    const nextValue = valueFunc(value);

                    return [delayMillis, nextValue];
                }
            }
        }

        return null;
    };
};

export const extractEventHandleFunc = async function (eventName: string) {
    const sql2 = `SELECT * FROM PolicyHandleUserEvent WHERE event_name LIKE '${eventName}'`;
    const policies = await database.queryOne(sql2);

    return (condition: string, value: number) => {
        for (let i = 0; i < policies.length; i++) {
            const policy = policies[i];

            const start = policy["range_start"];
            const end = policy["range_end"];

            if (condition == policy["condition"]) {
                if (start <= value && value <= end) {
                    const func = new Function("value", policy["function"]);
                    return func(value);
                }
            }
        }

        return null;
    };
};
