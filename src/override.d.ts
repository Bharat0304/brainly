export {};
declare global {
    namespace Express {
        export interface Request{
            Userid?:string
        }
    }
}