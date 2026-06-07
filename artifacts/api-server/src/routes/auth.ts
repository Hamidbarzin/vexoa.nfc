import { Router } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, ownersTable } from "@workspace/db/schema";

const router = Router();

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  if (!user.ownerId) {
    res.status(403).json({ error: "No owner profile linked to this account" });
    return;
  }

  const [owner] = await db
    .select()
    .from(ownersTable)
    .where(eq(ownersTable.id, user.ownerId))
    .limit(1);

  if (!owner) {
    res.status(403).json({ error: "Owner not found" });
    return;
  }

  req.session.userId = user.id;
  req.session.ownerId = user.ownerId;

  res.json({
    ownerId: user.ownerId,
    name: owner.name,
    email: user.email,
  });
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

export default router;
