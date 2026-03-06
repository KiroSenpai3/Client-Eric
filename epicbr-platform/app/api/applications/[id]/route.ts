import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ok, notFound, forbidden, unauthorized, parseBody, serverError } from "@/lib/api";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!["admin", "employer", "recruiter"].includes(session.role)) return forbidden();

    const apps = db.applications;
    const app = apps.find((a) => a.id === params.id);
    if (!app) return notFound("Application not found");

    const body = await parseBody<{ status?: string; notes?: string }>(req);

    const validStatuses = ["pending", "reviewing", "shortlisted", "interview", "offered", "hired", "rejected"];
    const updates: Partial<typeof app> = { updatedAt: new Date().toISOString() };

    if (body?.status && validStatuses.includes(body.status)) {
      updates.status = body.status as typeof app.status;
    }
    if (body?.notes !== undefined) updates.notes = body.notes;

    db.updateApplication(params.id, updates);

    const updated = db.applications.find((a) => a.id === params.id);
    return ok(updated);
  } catch (e) {
    console.error("[PATCH /api/applications/:id]", e);
    return serverError();
  }
}
