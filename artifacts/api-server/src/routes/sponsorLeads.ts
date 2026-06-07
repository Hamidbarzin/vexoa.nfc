import { Router } from "express";
import { db } from "@workspace/db";
import { sponsorLeadsTable } from "@workspace/db/schema";
import { CreateSponsorLeadBody } from "@workspace/api-zod";

const router = Router();

router.post("/sponsor-leads", async (req, res) => {
  const body = CreateSponsorLeadBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body", details: body.error.issues });
    return;
  }

  const inserted = await db
    .insert(sponsorLeadsTable)
    .values({
      sponsorId: body.data.sponsorId,
      ownerId: body.data.ownerId,
      nfcToken: body.data.nfcToken,
      sourceUsername: body.data.sourceUsername,
      name: body.data.name,
      email: body.data.email,
      phone: body.data.phone,
      status: "new",
    })
    .returning();

  res.status(201).json(inserted[0]);
});

export default router;
