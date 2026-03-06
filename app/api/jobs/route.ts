import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ok, created, error, forbidden, unauthorized, parseBody, serverError, getSearchParams } from "@/lib/api";
import { Job } from "@/types";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(3),
  location: z.string().min(2),
  type: z.enum(["full-time", "part-time", "contract", "internship"]),
  salary: z.string().optional(),
  description: z.string().min(50),
  requirements: z.array(z.string()).min(1),
  responsibilities: z.array(z.string()).min(1),
  benefits: z.array(z.string()).default([]),
  category: z.string().min(2),
  deadline: z.string().optional(),
});

// GET /api/jobs — list jobs with optional filters
export async function GET(req: NextRequest) {
  try {
    const params = getSearchParams(req.url);
    const jobs = db.getJobs({
      status: params.status,
      category: params.category,
      search: params.search,
      companyId: params.companyId,
    });

    const page = parseInt(params.page ?? "1");
    const pageSize = parseInt(params.pageSize ?? "10");
    const start = (page - 1) * pageSize;
    const paginated = jobs.slice(start, start + pageSize);

    return ok({
      items: paginated,
      total: jobs.length,
      page,
      pageSize,
      totalPages: Math.ceil(jobs.length / pageSize),
    });
  } catch (e) {
    console.error("[GET /api/jobs]", e);
    return serverError();
  }
}

// POST /api/jobs — create a new job (employer/admin/recruiter only)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (!["employer", "admin", "recruiter"].includes(session.role)) return forbidden();

    const body = await parseBody<unknown>(req);
    const result = createSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((e) => { if (e.path[0]) errors[e.path[0] as string] = e.message; });
      return error("Validation failed", 400, errors);
    }

    const user = db.findUserById(session.userId);
    const job: Job = {
      id: db.nextId(),
      ...result.data,
      company: user?.name ?? "Unknown Company",
      companyId: session.userId,
      status: "active",
      postedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicantsCount: 0,
    };

    db.addJob(job);
    return created(job);
  } catch (e) {
    console.error("[POST /api/jobs]", e);
    return serverError();
  }
}
