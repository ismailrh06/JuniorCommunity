/**
 * /api/security
 *
 * GET    — list all security events          (admin only)
 * POST   — log a new security event          (public — called from client on auth errors)
 * PATCH  — resolve an event by id            (admin only)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@juniorcode/db/server";
import {
  getSecurityEvents,
  logSecurityEvent,
  resolveSecurityEvent,
  trackFailedLogin,
  trackApiRequest,
  type SecurityEventType,
  type SecuritySeverity,
} from "@/lib/security-store";

const VALID_EVENT_TYPES = new Set<SecurityEventType>([
  "brute_force",
  "suspicious_ip",
  "role_escalation",
  "mass_request",
  "invalid_token",
  "scraping",
]);

const VALID_SEVERITIES = new Set<SecuritySeverity>([
  "critical",
  "high",
  "medium",
  "low",
]);

// ── Helpers ────────────────────────────────────────────────────────────────

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "0.0.0.0"
  );
}

function isMockMode(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return supabaseUrl === "" || supabaseUrl.includes("placeholder");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function isAdmin(): Promise<boolean> {
  if (isMockMode()) {
    const cookieStore = await cookies();
    const raw = cookieStore.get("jc-mock-user")?.value;
    if (!raw) return false;
    try {
      const user = JSON.parse(Buffer.from(raw, "base64").toString("utf-8")) as {
        role?: string;
      };
      return user.role === "admin";
    } catch {
      return false;
    }
  }

  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  // Generated DB types can lag behind local migrations.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}

// ── GET ────────────────────────────────────────────────────────────────────

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const events = getSecurityEvents();
  return NextResponse.json({ events });
}

// ── POST ───────────────────────────────────────────────────────────────────

type LogPayload = {
  type: SecurityEventType;
  severity: SecuritySeverity;
  user_id?: string | null;
  description: string;
  /** email used during a login attempt — for brute-force tracking */
  email?: string;
};

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const eventType = body.type;
  const severityValue = body.severity;
  const rawDescription = body.description;

  if (
    typeof eventType !== "string" ||
    !VALID_EVENT_TYPES.has(eventType as SecurityEventType) ||
    typeof severityValue !== "string" ||
    !VALID_SEVERITIES.has(severityValue as SecuritySeverity) ||
    typeof rawDescription !== "string" ||
    rawDescription.trim().length < 8 ||
    rawDescription.length > 1000
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const rawEmail = body.email;
  const rawUserId = body.user_id;

  if (rawEmail !== undefined && typeof rawEmail !== "string") {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (rawEmail && rawEmail.length > 320) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (rawUserId !== undefined && typeof rawUserId !== "string") {
    return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
  }

  // Rate-limit the security API itself to prevent log flooding
  const { isMassRequest } = trackApiRequest(ip, "security-log");
  if (isMassRequest) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  // For brute_force events: use in-memory tracker to auto-escalate severity
  let type = eventType as SecurityEventType;
  let severity = severityValue as SecuritySeverity;
  let description = rawDescription.trim();

  if (type === "brute_force" && rawEmail) {
    const { count, isBruteForce } = trackFailedLogin(ip, rawEmail);
    if (isBruteForce) {
      severity = "critical";
      description = `${count} tentatives de connexion échouées depuis ${ip} pour l'email "${rawEmail}" en moins de 5 min.`;
    } else if (count >= 3) {
      severity = "high";
      description = `${count} tentatives de connexion échouées depuis ${ip} pour l'email "${rawEmail}".`;
    }
  }

  const event = logSecurityEvent({
    type,
    severity,
    user_id: rawUserId ?? null,
    ip,
    description,
  });

  return NextResponse.json({ event }, { status: 201 });
}

// ── PATCH ──────────────────────────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { id: string };
  try {
    body = (await req.json()) as { id: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const ok = resolveSecurityEvent(body.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
