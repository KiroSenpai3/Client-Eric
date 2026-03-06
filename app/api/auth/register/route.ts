import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, setAuthCookie } from "@/lib/auth";
import { ok, created, error, parseBody, serverError } from "@/lib/api";
import { User, UserRole } from "@/types";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["employer", "recruiter", "jobseeker"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody<unknown>(req);
    if (!body) return error("Invalid request body");

    const result = schema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        if (e.path[0]) errors[e.path[0] as string] = e.message;
      });
      return error("Validation failed", 400, errors);
    }

    const { name, email, password, role } = result.data;

    if (db.findUserByEmail(email)) {
      return error("An account with this email already exists", 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = {
      id: db.nextId(),
      name,
      email,
      role: role as UserRole,
      createdAt: new Date().toISOString(),
    };

    db.addUser(user, passwordHash);

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    setAuthCookie(token);

    return created({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (e) {
    console.error("[register]", e);
    return serverError();
  }
}
