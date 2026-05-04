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
import {
  getSecurityEvents,
  logSecurityEvent,
  resolveSecurityEvent,
  trackFailedLogin,
  trackApiRequest,
  type SecurityEventType,
  type SecuritySeverity,
} from "@/lib/security-store";

// ── Helpers ────────────────────────────────────────────────────────────────

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "0.0.0.0"
  );
}

async function isAdmin(): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const cookieStore = cookies();
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

  let body: LogPayload;
  try {
    body = (await req.json()) as LogPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate required fields
  if (!body.type || !body.severity || !body.description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Rate-limit the security API itself to prevent log flooding
  const { isMassRequest } = trackApiRequest(ip, "security-log");
  if (isMassRequest) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  // For brute_force events: use in-memory tracker to auto-escalate severity
  let { type, severity, description } = body;

  if (type === "brute_force" && body.email) {
    const { count, isBruteForce } = trackFailedLogin(ip, body.email);
    if (isBruteForce) {
      severity = "critical";
      description = `${count} tentatives de connexion échouées depuis ${ip} pour l'email "${body.email}" en moins de 5 min.`;
    } else if (count >= 3) {
      severity = "high";
      description = `${count} tentatives de connexion échouées depuis ${ip} pour l'email "${body.email}".`;
    }
  }

  const event = logSecurityEvent({
    type,
    severity,
    user_id: body.user_id ?? null,
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
