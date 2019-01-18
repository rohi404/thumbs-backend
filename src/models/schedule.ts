export interface ScheduleResult {
    thumb_id: string;
    timeout: string;
    condition: string;
    value: string;
}

export interface Schedule {
    thumbId: number;
    timeout: number;
    condition: string;
    value: string;
}

export const convertToSchedule = function(result: ScheduleResult): Schedule {
    return {
        thumbId: parseInt(result['thumb_id']),
        timeout: parseInt(result['timeout']),
        condition: result['condition'],
        value: result['value'],
    }
};