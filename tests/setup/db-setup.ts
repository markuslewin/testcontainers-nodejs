// https://github.com/epicweb-dev/epic-stack/blob/282f32c3a555459d50e0f69fb8b95551159afe61/tests/setup/db-setup.ts
import { afterAll, beforeEach } from "vitest";
import { msSqlServerContainerInject } from "./ms-sql-server-container";
import { execa } from "execa";

const { VITEST_POOL_ID } = process.env;
if (VITEST_POOL_ID === undefined) {
  throw new Error("Expected pool ID");
}

const container = msSqlServerContainerInject();
const connectionString = `sqlserver://${container.host}:${container.port};database=${VITEST_POOL_ID};user=${container.username};password=${container.password};encrypt=true;trustServerCertificate=true`;
process.env.DATABASE_URL = connectionString;

beforeEach(async () => {
  await execa({
    env: {
      DATABASE_URL: connectionString,
    },
  })`prisma migrate reset --force --skip-generate --skip-seed`;
});

afterAll(async () => {
  // Import dynamically to avoid instantiating the `PrismaClient` before the correct `DATABASE_URL` has been set above
  const { prisma } = await import("../../src/prisma");
  await prisma.$disconnect();
});
