import { NextRequest } from "next/server";
import { getSession, clearAuthCookie } from "@/lib/auth";
import { ok, unauthorized } from "@/lib/api";

export async function POST() {
  clearAuthCookie();
  return ok({ message: "Logged out successfully" });
}
