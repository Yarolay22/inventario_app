
class ErrorAppHttp extends Error {

    public status: number;

    constructor(status: number, message: string) {
        super(message)
        this.status = status;
        this.message = message;
    }

}

export default ErrorAppHttp;