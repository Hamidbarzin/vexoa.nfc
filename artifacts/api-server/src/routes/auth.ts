import { Router } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, ownersTable } from "@workspace/db/schema";
import { establishOwnerSession, regenerateSession, saveSession } from "../lib/session";

const router = Router();

router.get("/auth/session", async (req, res) => {
  const userId = req.session?.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  let name = user.email.split("@")[0] ?? "User";
  if (user.ownerId) {
    const [owner] = await db
      .select({ name: ownersTable.name })
      .from(ownersTable)
      .where(eq(ownersTable.id, user.ownerId))
      .limit(1);
    if (owner) {
      name = owner.name;
    }
  }

  res.json({
    userId: user.id,
    ownerId: user.ownerId ?? null,
    email: user.email,
    name,
    role: user.role,
  });
});

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

  let owner: { name: string } | undefined;
  if (user.ownerId) {
    const [found] = await db
      .select({ name: ownersTable.name })
      .from(ownersTable)
      .where(eq(ownersTable.id, user.ownerId))
      .limit(1);

    if (!found) {
      res.status(403).json({ error: "Owner not found" });
      return;
    }
    owner = found;
  } else if (user.role !== "admin") {
    res.status(403).json({ error: "No owner profile linked to this account" });
    return;
  }

  try {
    if (user.ownerId) {
      await establishOwnerSession(req, user.id, user.ownerId);
    } else {
      await regenerateSession(req);
      req.session.userId = user.id;
      await saveSession(req);
    }

    res.json({
      userId: user.id,
      ownerId: user.ownerId ?? null,
      name: owner?.name ?? user.email.split("@")[0] ?? "Admin",
      email: user.email,
      role: user.role,
    });
  } catch {
    res.status(500).json({ error: "Failed to create session" });
  }
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: "Failed to logout" });
      return;
    }
    res.json({ ok: true });
  });
});

export default router;
