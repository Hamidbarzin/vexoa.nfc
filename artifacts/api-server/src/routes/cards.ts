import { Router } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { nfcCardsTable, ownersTable, usersTable, crmContactsTable } from "@workspace/db/schema";

const router = Router();

router.get("/cards/:token/status", async (req, res) => {
  const { token } = req.params;

  const [card] = await db
    .select()
    .from(nfcCardsTable)
    .where(eq(nfcCardsTable.token, token))
    .limit(1);

  if (!card) {
    res.status(404).json({ error: "Card not found" });
    return;
  }

  res.json({
    token: card.token,
    status: card.status,
    ownerId: card.ownerId ?? null,
  });
});

router.post("/cards/:token/activate", async (req, res) => {
  const { token } = req.params;

  const [card] = await db
    .select()
    .from(nfcCardsTable)
    .where(eq(nfcCardsTable.token, token))
    .limit(1);

  if (!card) {
    res.status(404).json({ error: "Card not found" });
    return;
  }

  if (card.status === "active" && card.ownerId) {
    res.status(400).json({ error: "Card already activated", status: "active" });
    return;
  }

  const {
    name, company, title, phone, email, website,
    instagram, linkedin, city, industry, bio, avatarUrl, password,
  } = req.body as {
    name: string; company?: string; title?: string; phone?: string;
    email: string; website?: string; instagram?: string; linkedin?: string;
    city?: string; industry?: string; bio?: string; avatarUrl?: string;
    password: string;
  };

  if (!name || !email || !password) {
    res.status(400).json({ error: "name, email and password are required" });
    return;
  }

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const baseUsername = email.split("@")[0]!.toLowerCase().replace(/[^a-z0-9]/g, "");
  let username = baseUsername;
  let attempt = 0;
  while (true) {
    const existing = await db
      .select({ id: ownersTable.id })
      .from(ownersTable)
      .where(eq(ownersTable.username, username))
      .limit(1);
    if (existing.length === 0) break;
    attempt++;
    username = `${baseUsername}${attempt}`;
  }

  const [owner] = await db
    .insert(ownersTable)
    .values({
      username,
      name,
      company: company || null,
      title: title || null,
      phone: phone || null,
      email,
      website: website || null,
      instagram: instagram || null,
      linkedin: linkedin || null,
      city: city || null,
      industry: industry || null,
      bio: bio || null,
      avatarUrl: avatarUrl || null,
    })
    .returning();

  const [user] = await db
    .insert(usersTable)
    .values({
      ownerId: owner!.id,
      email,
      passwordHash,
      role: "owner",
    })
    .returning();

  await db
    .update(nfcCardsTable)
    .set({ ownerId: owner!.id, status: "active", activatedAt: new Date() })
    .where(eq(nfcCardsTable.token, token));

  await db.insert(crmContactsTable).values({
    ownerId: owner!.id,
    name,
    company: company || null,
    email,
    phone: phone || null,
    city: city || null,
    industry: industry || null,
    source: "NFC Activation",
    nfcToken: token,
  });

  req.session.userId = user!.id;
  req.session.ownerId = owner!.id;

  res.status(201).json({
    ownerId: owner!.id,
    token,
    profileUrl: `/u/${token}`,
  });
});

export default router;
