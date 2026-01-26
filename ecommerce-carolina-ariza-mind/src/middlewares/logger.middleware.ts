import { Injectable, NestMiddleware } from '@nestjs/common';
import chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const actualDate = new Date();
    const date = actualDate.toLocaleDateString();
    const time = actualDate.toLocaleTimeString();

    res.on('finish', () => {
      const statusCode = res.statusCode;

      let methodColor: string;
      if (statusCode >= 400) {
        // Si hay error, no aplicar color al método
        methodColor = method;
      } else {
        switch (method) {
          case 'POST':
            methodColor = chalk.yellow.bold(method);
            break;
          case 'PUT':
            methodColor = chalk.blue.bold(method);
            break;
          case 'GET':
            methodColor = chalk.green.bold(method);
            break;
          case 'DELETE':
            methodColor = chalk.red.bold(method);
            break;
          default:
            methodColor = chalk.white.bold(method);
        }
      }
      const statusColor =
        statusCode >= 500
          ? chalk.bgRed.white(` ${statusCode} `)
          : statusCode >= 400
            ? chalk.red(` ${statusCode} `)
            : chalk.green(` ${statusCode} `);

      const ipColor = chalk.cyan(ip);

      console.log(
        `${methodColor} ${chalk.yellow(originalUrl)} ${statusColor} ${chalk.white()} IP: ${ipColor}`,
        `[${date} ${time}] `,
      );
    });

    next();
  }
}
