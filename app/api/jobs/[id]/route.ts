import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ok, error, notFound, forbidden, unauthorized, parseBody, serverError } from "@/lib/api";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const job = db.findJobById(params.id);
  if (!job) return notFound("Job not found");
  return ok(job);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const job = db.findJobById(params.id);
    if (!job) return notFound("Job not found");

    // Only the owner or admin can update
    if (job.companyId !== session.userId && session.role !== "admin") return forbidden();

    const body = await parseBody<Partial<typeof job>>(req);
    if (!body) return error("Invalid body");

    const allowed = ["title", "status", "salary", "description", "requirements", "responsibilities", "benefits", "category", "deadline", "location", "type"];
    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    for (const key of allowed) {
      if (key in (body as object)) updates[key] = (body as Record<string, unknown>)[key];
    }

    db.updateJob(params.id, updates);
    return ok(db.findJobById(params.id));
  } catch (e) {
    console.error("[PATCH /api/jobs/:id]", e);
    return serverError();
  }
}
