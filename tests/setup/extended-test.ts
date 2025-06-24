import { test as baseTest } from "vitest";
import { PrismaClient } from "../../generated/prisma";
import { msSqlServerContainerInject } from "./ms-sql-server-container";
import { execa } from "execa";

export const test = baseTest.extend<{ prisma: PrismaClient }>({
  prisma: async ({ task }, use) => {
    const container = msSqlServerContainerInject();
    const connectionString = `sqlserver://${container.host}:${container.port};database=${task.id};user=${container.username};password=${container.password};encrypt=true;trustServerCertificate=true`;

    await execa({
      env: {
        DATABASE_URL: connectionString,
      },
    })`prisma migrate reset --force --skip-generate --skip-seed`;

    const prisma = new PrismaClient({
      datasourceUrl: connectionString,
      // log: ["error", "info", "query", "warn"],
    });

    await use(prisma);

    await prisma.$disconnect();
  },
});
