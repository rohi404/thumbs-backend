exports.valueToLabel = function(value) {
    const ranges = [0, 30, 70, 101];
    const strings = ["low", "normal", "high"];

    for(let i = 0; i < ranges.length - 1; i++) {
        const start = ranges[i];
        const end = ranges[i + 1];

        if (start <= value && value <= end - 1) {
            return strings[i];
        }
    }

    return null;
};

exports.determineScheduleDelayMillis = function(nowValue) {
    return [1000, nowValue - 1]; // [delay millis, next value]
};