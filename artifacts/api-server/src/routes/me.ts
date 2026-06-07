import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { ownersTable } from "@workspace/db/schema";
import { isSafeHttpUrl } from "../lib/safe-url";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.ownerId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
}

router.get("/me", requireAuth, async (req, res) => {
  const ownerId = req.session!.ownerId as number;

  const [owner] = await db
    .select()
    .from(ownersTable)
    .where(eq(ownersTable.id, ownerId))
    .limit(1);

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

router.patch("/me/profile", requireAuth, async (req, res) => {
  const ownerId = req.session!.ownerId as number;

  const {
    name, title, company, bio, avatarUrl,
    phone, email, website, instagram, linkedin,
    city, industry, socialLinks,
  } = req.body as Record<string, string | object>;

  if (website !== undefined && website && !isSafeHttpUrl(website as string)) {
    res.status(400).json({ error: "Invalid website URL. Use http or https only." });
    return;
  }

  const [updated] = await db
    .update(ownersTable)
    .set({
      ...(name !== undefined && { name: name as string }),
      ...(title !== undefined && { title: title as string }),
      ...(company !== undefined && { company: company as string }),
      ...(bio !== undefined && { bio: bio as string }),
      ...(avatarUrl !== undefined && { avatarUrl: avatarUrl as string }),
      ...(phone !== undefined && { phone: phone as string }),
      ...(email !== undefined && { email: email as string }),
      ...(website !== undefined && { website: website as string }),
      ...(instagram !== undefined && { instagram: instagram as string }),
      ...(linkedin !== undefined && { linkedin: linkedin as string }),
      ...(city !== undefined && { city: city as string }),
      ...(industry !== undefined && { industry: industry as string }),
      ...(socialLinks !== undefined && { socialLinks }),
      updatedAt: new Date(),
    })
    .where(eq(ownersTable.id, ownerId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Owner not found" });
    return;
  }

  res.json({
    id: updated.id,
    username: updated.username,
    name: updated.name,
    title: updated.title,
    company: updated.company,
    bio: updated.bio,
    avatarUrl: updated.avatarUrl,
    phone: updated.phone,
    email: updated.email,
    website: updated.website,
    instagram: updated.instagram,
    linkedin: updated.linkedin,
    city: updated.city,
    industry: updated.industry,
    socialLinks: updated.socialLinks,
    createdAt: updated.createdAt.toISOString(),
  });
});

export default router;
