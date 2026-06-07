import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { ownersTable, nfcCardsTable } from "@workspace/db/schema";
import { normalizeCardStatus } from "@workspace/db";
import {
  GetOwnerByTokenParams,
  UpdateOwnerProfileBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/owners/:token", async (req, res) => {
  const params = GetOwnerByTokenParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }

  const { token } = params.data;

  const [card] = await db
    .select()
    .from(nfcCardsTable)
    .where(eq(nfcCardsTable.token, token))
    .limit(1);

  let owner;

  if (card) {
    const status = normalizeCardStatus(card.status);

    if (status === "blank" || card.ownerId == null) {
      res.status(404).json({ error: "Card not activated", status: "blank" });
      return;
    }

    if (status === "lost") {
      res.status(403).json({ error: "Card reported as lost", status: "lost" });
      return;
    }

    if (status === "suspended") {
      res.status(403).json({ error: "Card suspended", status: "suspended" });
      return;
    }

    if (status !== "active") {
      res.status(403).json({ error: "Card unavailable", status });
      return;
    }

    const owners = await db
      .select()
      .from(ownersTable)
      .where(eq(ownersTable.id, card.ownerId))
      .limit(1);
    owner = owners[0];
  } else {
    const owners = await db
      .select()
      .from(ownersTable)
      .where(eq(ownersTable.username, token))
      .limit(1);
    owner = owners[0];
  }

  if (!owner) {
    res.status(404).json({ error: "Owner not found" });
    return;
  }

  res.json({
    id: owner.id,
    username: owner.username,
    name: owner.name,
    title: owner.title,
    company: owner.company,
    bio: owner.bio,
    avatarUrl: owner.avatarUrl,
    phone: owner.phone,
    email: owner.email,
    website: owner.website,
    instagram: owner.instagram,
    linkedin: owner.linkedin,
    city: owner.city,
    industry: owner.industry,
    socialLinks: owner.socialLinks,
    createdAt: owner.createdAt.toISOString(),
  });
});

router.patch("/owners/:id/profile", async (req: any, res: any) => {
  if (!req.session?.ownerId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  if (req.session.ownerId !== id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const body = UpdateOwnerProfileBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }

  const updated = await db
    .update(ownersTable)
    .set(body.data)
    .where(eq(ownersTable.id, id))
    .returning();

  if (!updated[0]) {
    res.status(404).json({ error: "Owner not found" });
    return;
  }

  res.json(updated[0]);
});

export default router;
