/**
 * security-store.ts — Server-only (Node.js runtime)
 * Persistent file-based security event log + in-memory rate trackers.
 *
 * Events are written to  apps/web/data/security-events.json
 * which is excluded from git (see .gitignore).
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// ── Types ──────────────────────────────────────────────────────────────────

export type SecurityEventType =
  | "brute_force"
  | "suspicious_ip"
  | "role_escalation"
  | "mass_request"
  | "invalid_token"
  | "scraping";

export type SecuritySeverity = "critical" | "high" | "medium" | "low";

export type SecurityEvent = {
  id: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  user_id: string | null;
  ip: string;
  description: string;
  created_at: string;
  resolved: boolean;
};

// ── Storage ────────────────────────────────────────────────────────────────

const DATA_DIR = join(process.cwd(), "data");
const EVENTS_FILE = join(DATA_DIR, "security-events.json");
const MAX_EVENTS = 500;

function ensureDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadEvents(): SecurityEvent[] {
  try {
    if (!existsSync(EVENTS_FILE)) return [];
    return JSON.parse(readFileSync(EVENTS_FILE, "utf-8")) as SecurityEvent[];
  } catch {
    return [];
  }
}

function saveEvents(events: SecurityEvent[]): void {
  ensureDir();
  writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), "utf-8");
}

// ── Public API ─────────────────────────────────────────────────────────────

/** Return all recorded security events (newest first). */
export function getSecurityEvents(): SecurityEvent[] {
  return loadEvents();
}

/** Persist a new security event and return it. */
export function logSecurityEvent(
  event: Omit<SecurityEvent, "id" | "created_at" | "resolved">
): SecurityEvent {
  const events = loadEvents();
  const newEvent: SecurityEvent = {
    ...event,
    id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
    resolved: false,
  };
  events.unshift(newEvent);
  saveEvents(events.slice(0, MAX_EVENTS));
  return newEvent;
}

/** Mark an event as resolved. Returns false if the id was not found. */
export function resolveSecurityEvent(id: string): boolean {
  const events = loadEvents();
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  events[idx].resolved = true;
  saveEvents(events);
  return true;
}

// ── In-memory rate trackers (reset on server restart) ─────────────────────

const failedLoginMap = new Map<string, { count: number; firstSeen: number }>();
const requestRateMap = new Map<string, { count: number; firstSeen: number }>();

const LOGIN_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const LOGIN_BRUTE_THRESHOLD = 5;

const API_WINDOW_MS = 60 * 1000; // 1 minute
const API_MASS_THRESHOLD = 60;

/**
 * Track failed login attempts by IP + email pair.
 * Returns current count and whether brute-force threshold is exceeded.
 */
export function trackFailedLogin(
  ip: string,
  email: string
): { count: number; isBruteForce: boolean } {
  const key = `${ip}:${email}`;
  const now = Date.now();
  const entry = failedLoginMap.get(key);

  if (!entry || now - entry.firstSeen > LOGIN_WINDOW_MS) {
    failedLoginMap.set(key, { count: 1, firstSeen: now });
    return { count: 1, isBruteForce: false };
  }

  entry.count += 1;
  failedLoginMap.set(key, entry);
  return { count: entry.count, isBruteForce: entry.count >= LOGIN_BRUTE_THRESHOLD };
}

/**
 * Track API request rate per IP + endpoint.
 * Returns current count and whether mass-request threshold is exceeded.
 */
export function trackApiRequest(
  ip: string,
  endpoint: string
): { count: number; isMassRequest: boolean } {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const entry = requestRateMap.get(key);

  if (!entry || now - entry.firstSeen > API_WINDOW_MS) {
    requestRateMap.set(key, { count: 1, firstSeen: now });
    return { count: 1, isMassRequest: false };
  }

  entry.count += 1;
  requestRateMap.set(key, entry);
  return { count: entry.count, isMassRequest: entry.count >= API_MASS_THRESHOLD };
}
