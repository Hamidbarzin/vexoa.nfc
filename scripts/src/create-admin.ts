import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: pnpm --filter @workspace/scripts run create-admin <email> <password>");
  process.exit(1);
}

async function main() {
  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existing) {
    await db
      .update(usersTable)
      .set({ role: "admin" })
      .where(eq(usersTable.email, email));
    console.log(`Updated existing user "${email}" to admin role`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(usersTable).values({
    email,
    passwordHash,
    role: "admin",
  });
  console.log(`Created admin user: ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
