import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { ownersTable } from "./owners";

export const crmContactsTable = pgTable("crm_contacts", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => ownersTable.id),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email"),
  phone: text("phone"),
  city: text("city"),
  industry: text("industry"),
  source: text("source").notNull().default("NFC Activation"),
  nfcToken: text("nfc_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCrmContactSchema = createInsertSchema(crmContactsTable).omit({ id: true, createdAt: true });
export type InsertCrmContact = z.infer<typeof insertCrmContactSchema>;
export type CrmContact = typeof crmContactsTable.$inferSelect;
