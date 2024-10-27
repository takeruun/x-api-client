export class TwitterError extends Error {
  public statusCode?: number;
  public error?: Error;

  constructor(message: string, statusCode?: number, error?: Error) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}
