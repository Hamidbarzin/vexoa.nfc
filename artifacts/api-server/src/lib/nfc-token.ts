import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { nfcCardsTable } from "@workspace/db/schema";

const TOKEN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const TOKEN_SUFFIX_LENGTH = 7;
const MAX_TOKEN_ATTEMPTS = 20;

export function generateNfcToken(): string {
  const bytes = randomBytes(TOKEN_SUFFIX_LENGTH);
  let suffix = "";

  for (let i = 0; i < TOKEN_SUFFIX_LENGTH; i++) {
    suffix += TOKEN_CHARS[bytes[i]! % TOKEN_CHARS.length]!;
  }

  return `VX-${suffix}`;
}

export async function generateUniqueNfcToken(): Promise<string> {
  for (let attempt = 0; attempt < MAX_TOKEN_ATTEMPTS; attempt++) {
    const token = generateNfcToken();
    const [existing] = await db
      .select({ id: nfcCardsTable.id })
      .from(nfcCardsTable)
      .where(eq(nfcCardsTable.token, token))
      .limit(1);

    if (!existing) {
      return token;
    }
  }

  throw new Error("Could not generate unique NFC token");
}
