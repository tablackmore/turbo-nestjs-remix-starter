import { randomUUID } from 'node:crypto';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface RequestWithId extends Request {
  requestId: string;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithId>();
    const requestId = randomUUID();

    // Add request ID to the request object for use in filters
    request.requestId = requestId;

    return next.handle().pipe(
      map((data) => {
        // Don't format if data is already in API response format
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        return {
          success: true,
          data,
          meta: {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            requestId,
          },
        };
      }),
    );
  }
}
