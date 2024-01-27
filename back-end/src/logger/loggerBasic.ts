import { Injectable, NestMiddleware, Logger, Req } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { stringify } from 'querystring';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(@Req() req, res: Response, next: NextFunction) {
    const { method, path } = req;
	// console.log(req);
	
    const message = `${method} ${req.params} ${req.user}`;

    Logger.log(message, 'IncomingRequest');

    res.on('finish', () => {
      const { statusCode } = res;
      const responseMessage = `${method} ${path} ${statusCode}`;
      Logger.log(responseMessage, 'OutgoingResponse');
    });

    next();
  }
}