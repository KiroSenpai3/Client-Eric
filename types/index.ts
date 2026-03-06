// ─── Auth & Users ─────────────────────────────────────────────────────────────

export type UserRole = "admin" | "employer" | "recruiter" | "jobseeker";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export type JobType = "full-time" | "part-time" | "contract" | "internship";
export type JobStatus = "active" | "closed" | "draft" | "paused";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string;
  type: JobType;
  status: JobStatus;
  salary?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  category: string;
  deadline?: string;
  postedAt: string;
  updatedAt: string;
  applicantsCount: number;
}

// ─── Applications ─────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "offered"
  | "hired"
  | "rejected";

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  status: ApplicationStatus;
  coverLetter?: string;
  cvUrl?: string;
  appliedAt: string;
  updatedAt: string;
  notes?: string;
}

// ─── CV ───────────────────────────────────────────────────────────────────────

export interface CVProfile {
  id: string;
  userId: string;
  summary: string;
  phone: string;
  location: string;
  linkedin?: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  languages: string[];
  updatedAt: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  receivedAt: string;
  read: boolean;
}
