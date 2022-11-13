import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(message: string, httpStatus: number, private readonly data?: any) {
    super(message, httpStatus);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  getResponse() {
    const message = super.getResponse();
    return {
      statusCode: this.getStatus(),
      message: [message],
      error: message,
      ...(this.data && { data: this.data }),
    };
  }
}
