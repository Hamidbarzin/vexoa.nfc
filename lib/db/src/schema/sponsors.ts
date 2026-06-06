import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sponsorsTable = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  logoUrl: text("logo_url"),
  bgImageUrl: text("bg_image_url"),
  teaserImageUrl: text("teaser_image_url"),
  ctaText: text("cta_text").notNull().default("Get Started"),
  ctaUrl: text("cta_url").notNull().default("#"),
  targetCategories: text("target_categories").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSponsorSchema = createInsertSchema(sponsorsTable).omit({ id: true, createdAt: true });
export type InsertSponsor = z.infer<typeof insertSponsorSchema>;
export type Sponsor = typeof sponsorsTable.$inferSelect;
