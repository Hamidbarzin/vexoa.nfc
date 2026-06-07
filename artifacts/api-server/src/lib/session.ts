import type { Request } from "express";

export function regenerateSession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => (err ? reject(err) : resolve()));
  });
}

export function saveSession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.save((err) => (err ? reject(err) : resolve()));
  });
}

export async function establishOwnerSession(
  req: Request,
  userId: number,
  ownerId: number,
): Promise<void> {
  await regenerateSession(req);
  req.session.userId = userId;
  req.session.ownerId = ownerId;
  await saveSession(req);
}
