import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ok, unauthorized, serverError, parseBody } from "@/lib/api";
import { CVProfile } from "@/types";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    const cv = db.findCV(session.userId);
    return ok(cv ?? null);
  } catch (e) {
    console.error("[GET /api/cv]", e);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const body = await parseBody<Partial<CVProfile>>(req);
    if (!body) return unauthorized("Invalid body");

    const existing = db.findCV(session.userId);
    const cv: CVProfile = {
      id: existing?.id ?? db.nextId(),
      userId: session.userId,
      summary: body.summary ?? "",
      phone: body.phone ?? "",
      location: body.location ?? "",
      linkedin: body.linkedin,
      experience: body.experience ?? [],
      education: body.education ?? [],
      skills: body.skills ?? [],
      languages: body.languages ?? [],
      updatedAt: new Date().toISOString(),
    };

    db.upsertCV(cv);
    return ok(cv);
  } catch (e) {
    console.error("[POST /api/cv]", e);
    return serverError();
  }
}
