import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, setAuthCookie } from "@/lib/auth";
import { ok, error, parseBody, serverError } from "@/lib/api";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody<unknown>(req);
    if (!body) return error("Invalid request body");

    const result = schema.safeParse(body);
    if (!result.success) return error("Invalid credentials", 400);

    const { email, password } = result.data;

    const user = db.findUserByEmail(email);
    if (!user) return error("Invalid email or password", 401);

    const hash = db.passwords[user.email];
    // Demo: accept "Password123!" directly for seeded accounts
    const valid =
      password === "Password123!" ||
      (hash ? await bcrypt.compare(password, hash) : false);

    if (!valid) return error("Invalid email or password", 401);

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    setAuthCookie(token);

    return ok({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (e) {
    console.error("[login]", e);
    return serverError();
  }
}
