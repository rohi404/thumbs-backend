export interface UserResult {
    userId: number;
    id: string;
    pw: string;
    reg_date: string;
}

export interface User {
    userId: number;
    id: string;
    pw: string;
    reg_date: string;
}

export const convertToUser = function(result: UserResult): User {
    return {
        userId: parseInt(result['user_id']),
        id: result['id'],
        pw: result['pw'],
        reg_date: result['reg_date'],
    }
};