import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { nfcCardsTable } from "@workspace/db/schema";

async function main() {
  const updated = await db
    .update(nfcCardsTable)
    .set({ status: "blank" })
    .where(eq(nfcCardsTable.status, "inactive"))
    .returning({ id: nfcCardsTable.id });

  console.log(`Migrated ${updated.length} card(s) from "inactive" to "blank"`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
