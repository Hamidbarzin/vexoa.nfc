import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ownersTable = pgTable("owners", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  title: text("title"),
  company: text("company"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  city: text("city"),
  industry: text("industry"),
  socialLinks: jsonb("social_links"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOwnerSchema = createInsertSchema(ownersTable).omit({ id: true, createdAt: true });
export type InsertOwner = z.infer<typeof insertOwnerSchema>;
export type Owner = typeof ownersTable.$inferSelect;
