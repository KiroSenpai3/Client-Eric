import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ok, created, error, forbidden, unauthorized, parseBody, serverError, getSearchParams } from "@/lib/api";
import { Application } from "@/types";
import { z } from "zod";

const createSchema = z.object({
  jobId: z.string().min(1),
  coverLetter: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const params = getSearchParams(req.url);
    let filters: Parameters<typeof db.getApplications>[0] = {};

    if (session.role === "jobseeker") {
      filters = { applicantId: session.userId };
    } else if (session.role === "employer") {
      filters = { companyId: session.userId };
    } else if (session.role === "recruiter" || session.role === "admin") {
      if (params.jobId) filters = { jobId: params.jobId };
      if (params.applicantId) filters = { ...filters, applicantId: params.applicantId };
    }

    const applications = db.getApplications(filters);
    return ok(applications);
  } catch (e) {
    console.error("[GET /api/applications]", e);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (session.role !== "jobseeker") return forbidden("Only job seekers can apply");

    const body = await parseBody<unknown>(req);
    const result = createSchema.safeParse(body);
    if (!result.success) return error("Invalid request", 400);

    const { jobId, coverLetter } = result.data;

    const job = db.findJobById(jobId);
    if (!job) return error("Job not found", 404);
    if (job.status !== "active") return error("This job is no longer accepting applications", 400);

    // Prevent duplicate applications
    const existing = db.getApplications({ applicantId: session.userId }).find(a => a.jobId === jobId);
    if (existing) return error("You have already applied for this position", 400);

    const user = db.findUserById(session.userId);
    const application: Application = {
      id: db.nextId(),
      jobId,
      jobTitle: job.title,
      company: job.company,
      applicantId: session.userId,
      applicantName: user?.name ?? "Unknown",
      applicantEmail: user?.email ?? session.email,
      status: "pending",
      coverLetter,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.addApplication(application);
    return created(application);
  } catch (e) {
    console.error("[POST /api/applications]", e);
    return serverError();
  }
}
