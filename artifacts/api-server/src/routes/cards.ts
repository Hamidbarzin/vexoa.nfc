import { Router, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { nfcCardsTable, ownersTable, usersTable, crmContactsTable } from "@workspace/db/schema";
import { isActivatableStatus, normalizeCardStatus } from "@workspace/db";
import { isSafeHttpUrl } from "../lib/safe-url";
import { establishOwnerSession } from "../lib/session";

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
    status: normalizeCardStatus(card.status),
    ownerId: card.ownerId ?? null,
  });
});

async function generateUniqueUsername(email: string): Promise<string> {
  const baseUsername = email.split("@")[0]!.toLowerCase().replace(/[^a-z0-9]/g, "") || "owner";
  let username = baseUsername;

  for (let attempt = 0; attempt < 100; attempt++) {
    const [existing] = await db
      .select({ id: ownersTable.id })
      .from(ownersTable)
      .where(eq(ownersTable.username, username))
      .limit(1);

    if (!existing) return username;
    username = `${baseUsername}${attempt + 1}`;
  }

  throw new Error("Could not generate unique username");
}

router.post("/cards/:token/activate", async (req: Request, res: Response) => {
  const token = String(req.params.token);

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

  if (website && !isSafeHttpUrl(website)) {
    res.status(400).json({ error: "Invalid website URL. Use http or https only." });
    return;
  }

  const [existingUser] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existingUser) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  try {
    const username = await generateUniqueUsername(email);
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await db.transaction(async (tx) => {
      const [lockedCard] = await tx
        .select()
        .from(nfcCardsTable)
        .where(eq(nfcCardsTable.token, token))
        .for("update")
        .limit(1);

      if (!lockedCard) {
        throw new ActivationError(404, "Card not found");
      }

      if (lockedCard.status === "active" && lockedCard.ownerId) {
        throw new ActivationError(400, "Card already activated", "active");
      }

      if (!isActivatableStatus(lockedCard.status)) {
        throw new ActivationError(
          400,
          "Card cannot be activated",
          normalizeCardStatus(lockedCard.status),
        );
      }

      const [owner] = await tx
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

      const [user] = await tx
        .insert(usersTable)
        .values({
          ownerId: owner!.id,
          email,
          passwordHash,
          role: "owner",
        })
        .returning();

      await tx
        .update(ownersTable)
        .set({ userId: user!.id })
        .where(eq(ownersTable.id, owner!.id));

      await tx
        .update(nfcCardsTable)
        .set({ ownerId: owner!.id, status: "active", activatedAt: new Date() })
        .where(eq(nfcCardsTable.id, lockedCard.id));

      await tx.insert(crmContactsTable).values({
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

      return { owner: owner!, user: user! };
    });

    await establishOwnerSession(req, result.user.id, result.owner.id);

    res.status(201).json({
      ownerId: result.owner.id,
      userId: result.user.id,
      token,
      profileUrl: `/u/${token}`,
      email: result.user.email,
      name: result.owner.name,
      role: result.user.role,
    });
  } catch (err) {
    if (err instanceof ActivationError) {
      res.status(err.status).json({
        error: err.message,
        ...(err.cardStatus ? { status: err.cardStatus } : {}),
      });
      return;
    }

    res.status(500).json({ error: "Activation failed" });
  }
});

class ActivationError extends Error {
  constructor(
    public status: number,
    message: string,
    public cardStatus?: string,
  ) {
    super(message);
  }
}

export default router;
