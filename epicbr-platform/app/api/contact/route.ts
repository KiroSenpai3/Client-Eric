import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, error, parseBody, serverError } from "@/lib/api";
import { ContactMessage } from "@/types";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(20),
});

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody<unknown>(req);
    const result = schema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((e) => { if (e.path[0]) errors[e.path[0] as string] = e.message; });
      return error("Please correct the form errors", 400, errors);
    }

    const msg: ContactMessage = {
      id: db.nextId(),
      ...result.data,
      receivedAt: new Date().toISOString(),
      read: false,
    };

    db.addContact(msg);

    // In production: send email via SendGrid / Resend here
    console.log("[contact] New message from:", msg.email, "—", msg.subject);

    return ok({ message: "Thank you! We will be in touch shortly." });
  } catch (e) {
    console.error("[POST /api/contact]", e);
    return serverError();
  }
}
