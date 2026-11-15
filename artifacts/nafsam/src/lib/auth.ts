export interface SessionStatus {
  authed: boolean;
  openAt: number;
  isOpen: boolean;
}

export type LoginResult =
  | { ok: true }
  | { ok: false; reason: "wrong" | "closed" | "rate_limited" | "network" };

const FALLBACK_OPEN_AT = new Date("2026-05-29T17:00:00").getTime();

export async function fetchSession(): Promise<SessionStatus> {
  try {
    const res = await fetch("/api/auth/session", {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!res.ok) return { authed: false, openAt: FALLBACK_OPEN_AT, isOpen: false };
    const data = (await res.json()) as Partial<SessionStatus>;
    const openAt = Number.isFinite(data.openAt) ? (data.openAt as number) : FALLBACK_OPEN_AT;
    return {
      authed: Boolean(data.authed),
      openAt,
      isOpen: Boolean(data.isOpen),
    };
  } catch {
    return { authed: false, openAt: FALLBACK_OPEN_AT, isOpen: false };
  }
}

export async function login(answer: string): Promise<LoginResult> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: answer.trim() }),
    });
    if (res.ok) return { ok: true };
    if (res.status === 403) return { ok: false, reason: "closed" };
    if (res.status === 429) return { ok: false, reason: "rate_limited" };
    return { ok: false, reason: "wrong" };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
  } catch {
    /* the session cookie is cleared server-side when reachable */
  }
}
