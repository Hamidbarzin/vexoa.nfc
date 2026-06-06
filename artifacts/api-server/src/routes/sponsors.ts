import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { sponsorsTable, ownersTable } from "@workspace/db/schema";
import { MatchSponsorQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/sponsors/match", async (req, res) => {
  const query = MatchSponsorQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }

  const { ownerId } = query.data;

  const owner = await db
    .select()
    .from(ownersTable)
    .where(eq(ownersTable.id, ownerId))
    .limit(1);

  if (!owner[0]) {
    res.status(404).json({ error: "Owner not found" });
    return;
  }

  const sponsors = await db.select().from(sponsorsTable).limit(10);

  if (sponsors.length === 0) {
    res.status(404).json({ error: "No sponsors available" });
    return;
  }

  const sponsor = sponsors[Math.floor(Math.random() * sponsors.length)];

  res.json({
    id: sponsor.id,
    name: sponsor.name,
    tagline: sponsor.tagline,
    logoUrl: sponsor.logoUrl,
    bgImageUrl: sponsor.bgImageUrl,
    teaserImageUrl: sponsor.teaserImageUrl,
    ctaText: sponsor.ctaText,
    ctaUrl: sponsor.ctaUrl,
    targetCategories: sponsor.targetCategories,
  });
});

export default router;
