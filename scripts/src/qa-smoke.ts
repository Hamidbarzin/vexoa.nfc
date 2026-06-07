/**
 * VELOXA Phase 1.5 smoke QA — run against a live API server.
 * Usage:
 *   DATABASE_URL=... SESSION_SECRET=... PORT=8080 pnpm --filter @workspace/scripts run qa-smoke
 */

const API = process.env.QA_API_BASE ?? "http://127.0.0.1:8080/api";
const ADMIN_EMAIL = process.env.QA_ADMIN_EMAIL ?? "qa-admin@veloxa.test";
const ADMIN_PASSWORD = process.env.QA_ADMIN_PASSWORD ?? "QaAdmin1234!";
const OWNER_EMAIL = `qa-owner-${Date.now()}@veloxa.test`;
const OWNER_PASSWORD = "OwnerPass1234!";

type Result = { id: number; ok: boolean; detail: string };

const results: Result[] = [];
let id = 0;
let cookieJar = "";
let cardToken = "";
let ownerId = 0;

function record(ok: boolean, detail: string) {
  id += 1;
  results.push({ id, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`[${mark}] ${id}. ${detail}`);
}

function extractCookies(res: Response) {
  const getSetCookie = (res.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.();
  if (getSetCookie?.length) {
    cookieJar = getSetCookie.map((c) => c.split(";")[0]).join("; ");
    return;
  }
  const single = res.headers.get("set-cookie");
  if (single) cookieJar = single.split(";")[0] ?? "";
}

async function api(
  method: string,
  path: string,
  body?: unknown,
  useCookie = false,
): Promise<{ status: number; data: any }> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (useCookie && cookieJar) headers.Cookie = cookieJar;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "include",
  });

  extractCookies(res);
  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  return { status: res.status, data };
}

async function main() {
  console.log(`\nVELOXA QA smoke against ${API}\n`);

  // 1-2 Admin auth
  let r = await api("GET", "/admin/cards");
  record(r.status === 401, `Unauthenticated admin blocked (${r.status})`);

  r = await api("POST", "/auth/login", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  record(r.status === 200 && r.data?.role === "admin", `Admin login (${r.status})`);

  // 3 Create blank card
  r = await api("POST", "/admin/cards", {}, true);
  cardToken = r.data?.token ?? "";
  record(
    r.status === 201 && cardToken.startsWith("VX-"),
    `Create blank card token=${cardToken || "missing"}`,
  );

  // 4 Card status blank
  r = await api("GET", `/cards/${cardToken}/status`);
  record(r.status === 200 && r.data?.status === "blank", `Blank card status (${r.data?.status})`);

  // 5 Public owner blocked before activation
  r = await api("GET", `/owners/${cardToken}`);
  record(r.status === 404, `Public owner blocked before activation (${r.status})`);

  // 6 Activate + account
  cookieJar = "";
  r = await api("POST", `/cards/${cardToken}/activate`, {
    name: "QA Owner",
    email: OWNER_EMAIL,
    password: OWNER_PASSWORD,
    company: "QA Co",
    title: "Founder",
    phone: "+10000000000",
    website: "https://example.com",
    city: "Berlin",
    industry: "Tech",
    bio: "QA activation profile",
  });
  ownerId = r.data?.ownerId ?? 0;
  record(
    r.status === 201 && ownerId > 0 && r.data?.userId > 0,
    `Activation creates owner+user (${r.status})`,
  );

  // 7 Auto login session
  r = await api("GET", "/auth/session", undefined, true);
  record(
    r.status === 200 && r.data?.role === "owner" && r.data?.ownerId === ownerId,
    `Auto session after activation (${r.data?.email})`,
  );

  // 8 Profile update
  r = await api(
    "PATCH",
    "/me/profile",
    { name: "QA Owner Updated", bio: "Updated via QA" },
    true,
  );
  record(r.status === 200 && r.data?.name === "QA Owner Updated", `Profile update (${r.status})`);

  // 9 Public profile after activation (no session cookie)
  cookieJar = "";
  r = await api("GET", `/owners/${cardToken}`);
  record(
    r.status === 200 && r.data?.name === "QA Owner Updated",
    `Public profile reflects update (${r.data?.name})`,
  );

  // 10 Sponsor + lead (admin session required after public fetch cleared cookies)
  await api("POST", "/auth/login", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

  r = await api("POST", "/admin/sponsors", {
    name: "QA Sponsor",
    tagline: "QA tagline",
    ctaText: "Learn",
    ctaUrl: "https://sponsor.example.com",
    logoUrl: "https://example.com/logo.png",
    bgImageUrl: "https://example.com/bg.png",
    teaserImageUrl: "https://example.com/teaser.png",
    targetCategories: ["Tech"],
  }, true);
  const sponsorId = r.data?.id ?? 0;
  record(r.status === 201 && sponsorId > 0, `Create sponsor (${r.status})`);

  r = await api("GET", `/sponsors/match?ownerId=${ownerId}`);
  const matchedSponsorId = r.data?.id ?? 0;
  record(r.status === 200 && matchedSponsorId > 0, `Match sponsor (${matchedSponsorId})`);

  r = await api("POST", "/sponsor-leads", {
    sponsorId: matchedSponsorId,
    ownerId,
    nfcToken: cardToken,
    name: "Lead Person",
    email: "lead@example.com",
    phone: "+19999999999",
  });
  record(r.status === 201, `Create sponsor lead (${r.status})`);

  r = await api("GET", "/admin/leads", undefined, true);
  const hasLead = Array.isArray(r.data) && r.data.some((l: any) => l.email === "lead@example.com");
  record(r.status === 200 && hasLead, `Lead visible in admin CRM (${hasLead})`);

  // 11 Invalid URL rejection (owner session required)
  r = await api("POST", "/auth/login", { email: OWNER_EMAIL, password: OWNER_PASSWORD });
  r = await api("PATCH", "/me/profile", { website: "javascript:alert(1)" }, true);
  record(r.status === 400, `Reject javascript: website (${r.status})`);

  // 12 Lost card guard (admin session required)
  r = await api("POST", "/auth/login", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  r = await api("GET", "/admin/cards", undefined, true);
  const cardRow = Array.isArray(r.data) ? r.data.find((c: any) => c.token === cardToken) : null;
  if (cardRow?.id) {
    await api("PATCH", `/admin/cards/${cardRow.id}/status`, { status: "lost" }, true);
    r = await api("GET", `/owners/${cardToken}`);
    record(r.status === 403, `Lost card public guard (${r.status})`);
    await api("PATCH", `/admin/cards/${cardRow.id}/status`, { status: "active" }, true);
  } else {
    record(false, "Could not find card for lost guard test");
  }

  // 13 Session persistence — re-login owner
  cookieJar = "";
  r = await api("POST", "/auth/login", { email: OWNER_EMAIL, password: OWNER_PASSWORD });
  record(r.status === 200, `Owner re-login (${r.status})`);
  r = await api("GET", "/auth/session", undefined, true);
  record(r.status === 200 && r.data?.email === OWNER_EMAIL, `Session persists (${r.data?.email})`);

  // 14 Logout
  r = await api("POST", "/auth/logout", {}, true);
  record(r.status === 200, `Logout (${r.status})`);
  r = await api("GET", "/auth/session", undefined, true);
  record(r.status === 401, `Session cleared after logout (${r.status})`);

  // 15 Admin pages
  r = await api("POST", "/auth/login", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  for (const path of ["/admin/cards", "/admin/owners", "/admin/sponsors", "/admin/leads", "/admin/crm/contacts"]) {
    r = await api("GET", path, undefined, true);
    record(r.status === 200, `Admin page ${path} (${r.status})`);
  }

  const passed = results.filter((x) => x.ok).length;
  const failed = results.length - passed;
  console.log(`\nQA summary: ${passed}/${results.length} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
