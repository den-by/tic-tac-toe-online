import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs";
import { plainToInstance } from "class-transformer";
import * as clv from "class-validator";
import express from "express";

interface ClassConstructor {
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data: ClassConstructor) => {
        const instance = plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
        const validationErrors = await clv.validate(instance);
        if (validationErrors.length) {
          const message = "Validation failed";
          const response = context
            .switchToHttp()
            .getResponse<express.Response>();
          const statusCode = 500;
          response.status(statusCode);
          return { statusCode, message, errors: validationErrors };
        } else {
          return instance;
        }
      }),
    );
  }
}
