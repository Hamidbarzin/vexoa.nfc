import { Router } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  ownersTable,
  nfcCardsTable,
  sponsorsTable,
  sponsorLeadsTable,
  crmContactsTable,
} from "@workspace/db/schema";
import {
  AdminGetLeadsQueryParams,
  AdminUpdateLeadStatusParams,
  AdminUpdateLeadStatusBody,
  AdminCreateOwnerBody,
  AdminCreateSponsorBody,
  AdminUpdateCardStatusParams,
  AdminUpdateCardStatusBody,
} from "@workspace/api-zod";
import { requireAdmin } from "../middleware/requireAdmin";
import { isCardStatus, normalizeCardStatus } from "@workspace/db";
import { isSafeHttpUrl } from "../lib/safe-url";
import { generateUniqueNfcToken } from "../lib/nfc-token";

const router = Router();

router.use((req, res, next) => {
  if (!req.path.startsWith("/admin")) {
    return next("router");
  }
  next();
});

router.use(requireAdmin);

router.get("/admin/stats", async (req, res) => {
  const [totalLeadsRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(sponsorLeadsTable);

  const [totalOwnersRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ownersTable);

  const [totalSponsorsRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(sponsorsTable);

  const [newLeadsTodayRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(sponsorLeadsTable)
    .where(sql`date(created_at) = current_date`);

  const leadsByStatus = await db
    .select({
      status: sponsorLeadsTable.status,
      count: sql<number>`count(*)::int`,
    })
    .from(sponsorLeadsTable)
    .groupBy(sponsorLeadsTable.status);

  res.json({
    totalLeads: totalLeadsRow.count,
    totalOwners: totalOwnersRow.count,
    totalSponsors: totalSponsorsRow.count,
    newLeadsToday: newLeadsTodayRow.count,
    leadsByStatus,
  });
});

router.get("/admin/leads", async (req, res) => {
  const query = AdminGetLeadsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query" });
    return;
  }

  const leads = await db
    .select({
      id: sponsorLeadsTable.id,
      sponsorId: sponsorLeadsTable.sponsorId,
      ownerId: sponsorLeadsTable.ownerId,
      nfcToken: sponsorLeadsTable.nfcToken,
      sourceUsername: sponsorLeadsTable.sourceUsername,
      name: sponsorLeadsTable.name,
      email: sponsorLeadsTable.email,
      phone: sponsorLeadsTable.phone,
      status: sponsorLeadsTable.status,
      createdAt: sponsorLeadsTable.createdAt,
      sponsorName: sponsorsTable.name,
      ownerName: ownersTable.name,
    })
    .from(sponsorLeadsTable)
    .leftJoin(sponsorsTable, eq(sponsorLeadsTable.sponsorId, sponsorsTable.id))
    .leftJoin(ownersTable, eq(sponsorLeadsTable.ownerId, ownersTable.id))
    .orderBy(desc(sponsorLeadsTable.createdAt));

  res.json(
    leads.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() }))
  );
});

router.patch("/admin/leads/:id/status", async (req, res) => {
  const params = AdminUpdateLeadStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }

  const body = AdminUpdateLeadStatusBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const updated = await db
    .update(sponsorLeadsTable)
    .set({ status: body.data.status })
    .where(eq(sponsorLeadsTable.id, params.data.id))
    .returning();

  if (!updated[0]) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  res.json({ ...updated[0], createdAt: updated[0].createdAt.toISOString() });
});

router.get("/admin/owners", async (req, res) => {
  const owners = await db.select().from(ownersTable).orderBy(desc(ownersTable.createdAt));
  const cards = await db.select().from(nfcCardsTable);

  const cardMap = new Map(cards.map((c) => [c.ownerId, c]));

  const result = owners.map((o) => {
    const card = cardMap.get(o.id);
    return {
      id: o.id,
      username: o.username,
      name: o.name,
      title: o.title,
      company: o.company,
      bio: o.bio,
      avatarUrl: o.avatarUrl,
      phone: o.phone,
      email: o.email,
      website: o.website,
      city: o.city,
      industry: o.industry,
      socialLinks: o.socialLinks,
      nfcToken: card?.token ?? "",
      profileUrl: card ? `/u/${card.token}` : `/u/${o.username}`,
    };
  });

  res.json(result);
});

router.post("/admin/owners", async (req, res) => {
  const body = AdminCreateOwnerBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body", details: body.error.issues });
    return;
  }

  const owner = await db
    .insert(ownersTable)
    .values({
      username: body.data.username,
      name: body.data.name,
      title: body.data.title,
      company: body.data.company,
      bio: body.data.bio,
      phone: body.data.phone,
      email: body.data.email,
      website: body.data.website,
      city: body.data.city,
      industry: body.data.industry,
    })
    .returning();

  let token: string;
  try {
    token = await generateUniqueNfcToken();
  } catch {
    res.status(500).json({ error: "Failed to generate NFC token" });
    return;
  }

  const card = await db
    .insert(nfcCardsTable)
    .values({ ownerId: owner[0].id, token, status: "active" })
    .returning();

  res.status(201).json({
    id: owner[0].id,
    username: owner[0].username,
    name: owner[0].name,
    title: owner[0].title,
    company: owner[0].company,
    bio: owner[0].bio,
    avatarUrl: owner[0].avatarUrl,
    phone: owner[0].phone,
    email: owner[0].email,
    website: owner[0].website,
    city: owner[0].city,
    industry: owner[0].industry,
    socialLinks: owner[0].socialLinks,
    nfcToken: card[0].token,
    profileUrl: `/u/${card[0].token}`,
  });
});

router.get("/admin/sponsors", async (req, res) => {
  const sponsors = await db.select().from(sponsorsTable).orderBy(desc(sponsorsTable.createdAt));
  res.json(
    sponsors.map((s) => ({
      id: s.id,
      name: s.name,
      tagline: s.tagline,
      logoUrl: s.logoUrl,
      bgImageUrl: s.bgImageUrl,
      teaserImageUrl: s.teaserImageUrl,
      ctaText: s.ctaText,
      ctaUrl: s.ctaUrl,
      targetCategories: s.targetCategories,
    }))
  );
});

router.post("/admin/sponsors", async (req, res) => {
  const body = AdminCreateSponsorBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body", details: body.error.issues });
    return;
  }

  const urlFields = [
    ["ctaUrl", body.data.ctaUrl],
    ["logoUrl", body.data.logoUrl],
    ["bgImageUrl", body.data.bgImageUrl],
    ["teaserImageUrl", body.data.teaserImageUrl],
  ] as const;

  for (const [field, value] of urlFields) {
    if (value && !isSafeHttpUrl(value)) {
      res.status(400).json({ error: `Invalid ${field}. Use http or https only.` });
      return;
    }
  }

  const sponsor = await db
    .insert(sponsorsTable)
    .values({
      name: body.data.name,
      tagline: body.data.tagline,
      logoUrl: body.data.logoUrl,
      bgImageUrl: body.data.bgImageUrl,
      teaserImageUrl: body.data.teaserImageUrl,
      ctaText: body.data.ctaText,
      ctaUrl: body.data.ctaUrl,
      targetCategories: body.data.targetCategories,
    })
    .returning();

  res.status(201).json({
    id: sponsor[0].id,
    name: sponsor[0].name,
    tagline: sponsor[0].tagline,
    logoUrl: sponsor[0].logoUrl,
    bgImageUrl: sponsor[0].bgImageUrl,
    teaserImageUrl: sponsor[0].teaserImageUrl,
    ctaText: sponsor[0].ctaText,
    ctaUrl: sponsor[0].ctaUrl,
    targetCategories: sponsor[0].targetCategories,
  });
});

router.get("/admin/cards", async (req, res) => {
  const cards = await db
    .select({
      id: nfcCardsTable.id,
      ownerId: nfcCardsTable.ownerId,
      token: nfcCardsTable.token,
      status: nfcCardsTable.status,
      activatedAt: nfcCardsTable.activatedAt,
      createdAt: nfcCardsTable.createdAt,
      ownerName: ownersTable.name,
      ownerUsername: ownersTable.username,
    })
    .from(nfcCardsTable)
    .leftJoin(ownersTable, eq(nfcCardsTable.ownerId, ownersTable.id))
    .orderBy(desc(nfcCardsTable.createdAt));

  res.json(
    cards.map((c) => ({
      id: c.id,
      ownerId: c.ownerId ?? null,
      token: c.token,
      status: normalizeCardStatus(c.status),
      activatedAt: c.activatedAt?.toISOString() ?? null,
      createdAt: c.createdAt.toISOString(),
      ownerName: c.ownerName ?? null,
      ownerUsername: c.ownerUsername ?? null,
      profileUrl: c.ownerId ? `/u/${c.token}` : null,
    }))
  );
});

router.post("/admin/cards", async (req, res) => {
  let token: string;
  try {
    token = await generateUniqueNfcToken();
  } catch {
    res.status(500).json({ error: "Failed to generate NFC token" });
    return;
  }

  const [card] = await db
    .insert(nfcCardsTable)
    .values({ token, status: "blank" })
    .returning();

  res.status(201).json({
    id: card!.id,
    ownerId: null,
    token: card!.token,
    status: card!.status,
    activatedAt: null,
    createdAt: card!.createdAt.toISOString(),
    ownerName: null,
    ownerUsername: null,
    profileUrl: null,
  });
});

router.patch("/admin/cards/:id/status", async (req, res) => {
  const params = AdminUpdateCardStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid params" });
    return;
  }

  const body = AdminUpdateCardStatusBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  if (!isCardStatus(body.data.status)) {
    res.status(400).json({
      error: "Invalid status. Allowed: blank, active, lost, suspended",
    });
    return;
  }

  const updated = await db
    .update(nfcCardsTable)
    .set({ status: body.data.status })
    .where(eq(nfcCardsTable.id, params.data.id))
    .returning();

  if (!updated[0]) {
    res.status(404).json({ error: "Card not found" });
    return;
  }

  const owner = updated[0].ownerId
    ? await db.select().from(ownersTable).where(eq(ownersTable.id, updated[0].ownerId)).limit(1)
    : [];

  res.json({
    id: updated[0].id,
    ownerId: updated[0].ownerId ?? null,
    token: updated[0].token,
    status: updated[0].status,
    activatedAt: updated[0].activatedAt?.toISOString() ?? null,
    createdAt: updated[0].createdAt.toISOString(),
    ownerName: owner[0]?.name ?? null,
    ownerUsername: owner[0]?.username ?? null,
    profileUrl: updated[0].ownerId ? `/u/${updated[0].token}` : null,
  });
});

router.get("/admin/crm/contacts", async (req, res) => {
  const contacts = await db
    .select()
    .from(crmContactsTable)
    .orderBy(desc(crmContactsTable.createdAt));

  res.json(
    contacts.map((c) => ({
      id: c.id,
      ownerId: c.ownerId ?? null,
      name: c.name,
      company: c.company ?? null,
      email: c.email ?? null,
      phone: c.phone ?? null,
      city: c.city ?? null,
      industry: c.industry ?? null,
      source: c.source,
      nfcToken: c.nfcToken ?? null,
      createdAt: c.createdAt.toISOString(),
    }))
  );
});

export default router;
