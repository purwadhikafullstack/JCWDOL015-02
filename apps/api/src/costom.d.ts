type AUser = {
    userId: number;
    email: string;
    role: string;
}

declare namespace Express {
    export interface Request {
        user?:AUser
    }
}