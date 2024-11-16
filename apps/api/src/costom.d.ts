type AUser = {
    id: number;
    email: string;
    role: string;
}

declare namespace Express {
    export interface Request {
        user?:AUser
    }
}