import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, unauthorized } from "@/lib/api";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  const user = db.findUserById(session.userId);
  if (!user) return unauthorized("User not found");

  return ok({ id: user.id, name: user.name, email: user.email, role: user.role });
}
