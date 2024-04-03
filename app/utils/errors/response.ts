export const RESPONSE_ERROR = "ResponseError";

export class ResponseError extends Error implements Error {
  private _name = RESPONSE_ERROR;
  private _status: number;

  constructor(msg: string, status = 500) {
    super(msg);
    this._status = status;
  }

  public get name() {
    return this._name;
  }

  public get status() {
    return this._status;
  }
}
