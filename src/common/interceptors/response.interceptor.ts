import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    path: string;
    timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        return next.handle().pipe(
            map((data) => ({
                success: true,
                statusCode: response.statusCode,
                message: 'Request successful',
                data,
                path: request.url,
                timestamp: new Date().toISOString(),
            })),
        );
    }
}