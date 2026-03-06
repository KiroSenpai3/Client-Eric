import { NextResponse } from "next/server";
import { ApiResponse } from "@/types";

export function ok<T>(data: T, status = 200): NextResponse {
  const body: ApiResponse<T> = { success: true, data };
  return NextResponse.json(body, { status });
}

export function created<T>(data: T): NextResponse {
  return ok(data, 201);
}

export function error(message: string, status = 400, errors?: Record<string, string>): NextResponse {
  const body: ApiResponse = { success: false, message, errors };
  return NextResponse.json(body, { status });
}

export function unauthorized(message = "Unauthorized"): NextResponse {
  return error(message, 401);
}

export function forbidden(message = "Forbidden"): NextResponse {
  return error(message, 403);
}

export function notFound(message = "Not found"): NextResponse {
  return error(message, 404);
}

export function serverError(message = "Internal server error"): NextResponse {
  return error(message, 500);
}

/** Parse request body safely */
export async function parseBody<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

/** Extract search params as plain object */
export function getSearchParams(url: string): Record<string, string> {
  const { searchParams } = new URL(url);
  const result: Record<string, string> = {};
  searchParams.forEach((value, key) => { result[key] = value; });
  return result;
}
