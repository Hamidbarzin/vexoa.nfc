import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { ownersTable } from "./owners";
import { sponsorsTable } from "./sponsors";

export const sponsorLeadsTable = pgTable("sponsor_leads", {
  id: serial("id").primaryKey(),
  sponsorId: integer("sponsor_id").notNull().references(() => sponsorsTable.id),
  ownerId: integer("owner_id").notNull().references(() => ownersTable.id),
  nfcToken: text("nfc_token"),
  sourceUsername: text("source_username"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSponsorLeadSchema = createInsertSchema(sponsorLeadsTable).omit({ id: true, createdAt: true, status: true });
export type InsertSponsorLead = z.infer<typeof insertSponsorLeadSchema>;
export type SponsorLead = typeof sponsorLeadsTable.$inferSelect;
