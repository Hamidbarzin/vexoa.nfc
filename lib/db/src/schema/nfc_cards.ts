import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { ownersTable } from "./owners";

export const nfcCardsTable = pgTable("nfc_cards", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").notNull().references(() => ownersTable.id),
  token: text("token").notNull().unique(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNfcCardSchema = createInsertSchema(nfcCardsTable).omit({ id: true, createdAt: true });
export type InsertNfcCard = z.infer<typeof insertNfcCardSchema>;
export type NfcCard = typeof nfcCardsTable.$inferSelect;
