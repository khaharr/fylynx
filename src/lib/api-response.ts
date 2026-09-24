import { NextResponse } from 'next/server';

export interface ApiResponseOptions {
  status?: number;
  headers?: Record<string, string>;
}

export function apiSuccess<T>(data: T, options: ApiResponseOptions = {}) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    {
      status: options.status || 200,
      headers: options.headers,
    }
  );
}

export function apiError(
  message: string,
  options: ApiResponseOptions & { code?: string; details?: unknown } = {}
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code: options.code || 'BAD_REQUEST',
        details: options.details,
      },
    },
    {
      status: options.status || 400,
      headers: options.headers,
    }
  );
}

export function apiUnauthorized(message: string = 'Non autorisé. Veuillez vous connecter.') {
  return apiError(message, { status: 401, code: 'UNAUTHORIZED' });
}

export function apiForbidden(message: string = 'Accès refusé.') {
  return apiError(message, { status: 403, code: 'FORBIDDEN' });
}

export function apiNotFound(message: string = 'Ressource introuvable.') {
  return apiError(message, { status: 404, code: 'NOT_FOUND' });
}
