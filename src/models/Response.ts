export class Response {
    response: any;
    mensagem: string;
    constructor(obj: Partial<Response> = {}) {
        Object.assign(this, obj);
    }
}
