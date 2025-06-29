import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

interface RequestWithId extends Request {
  requestId?: string;
}

interface ValidationErrorDetail {
  field: string;
  code: string;
  message: string;
}

interface ExceptionResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithId>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract error details
    let errorCode = 'INTERNAL_ERROR';
    let errorMessage = 'An unexpected error occurred';
    let errorDetails: ValidationErrorDetail[] | undefined;

    if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as ExceptionResponse;

      if (status === HttpStatus.BAD_REQUEST && responseObj.message) {
        errorCode = 'VALIDATION_ERROR';
        errorMessage = 'The request contains invalid data';

        // Handle validation errors
        if (Array.isArray(responseObj.message)) {
          errorDetails = responseObj.message.map((msg: string) => ({
            field: 'unknown',
            code: 'VALIDATION_FAILED',
            message: msg,
          }));
        }
      } else if (status === HttpStatus.UNAUTHORIZED) {
        errorCode = 'AUTHENTICATION_ERROR';
        errorMessage = 'Authentication failed';
      } else if (status === HttpStatus.FORBIDDEN) {
        errorCode = 'AUTHORIZATION_ERROR';
        errorMessage = 'Access denied';
      } else if (status === HttpStatus.NOT_FOUND) {
        errorCode = 'RESOURCE_NOT_FOUND';
        errorMessage = 'Requested resource not found';
      } else if (status === HttpStatus.CONFLICT) {
        errorCode = 'RESOURCE_CONFLICT';
        errorMessage = 'Resource already exists';
      } else if (status === HttpStatus.TOO_MANY_REQUESTS) {
        errorCode = 'RATE_LIMIT_EXCEEDED';
        errorMessage = 'Too many requests';
      }

      if (responseObj.message && typeof responseObj.message === 'string') {
        errorMessage = responseObj.message;
      }
    }

    const errorResponse = {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        ...(errorDetails && { details: errorDetails }),
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: request.requestId || 'unknown',
      },
    };

    response.status(status).json(errorResponse);
  }
}
