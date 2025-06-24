import { test, expect } from "vitest";
import { createCustomer, getCustomers } from "./customer-repository";
import { PrismaClient } from "../generated/prisma";
import { execa } from "execa";
import { msSqlServerContainerInject } from "../tests/setup/ms-sql-server-container";

const setUpDatabase = async ({ database }: { database: string }) => {
  const container = msSqlServerContainerInject();
  const connectionString = `sqlserver://${container.host}:${container.port};database=${database};user=${container.username};password=${container.password};encrypt=true;trustServerCertificate=true`;

  await execa({
    env: {
      DATABASE_URL: connectionString,
    },
  })`prisma migrate reset --force --skip-generate --skip-seed`;

  const client = new PrismaClient({
    datasourceUrl: connectionString,
    // log: ["error", "info", "query", "warn"],
  });

  return {
    client,
    [Symbol.asyncDispose]: async () => {
      await client.$disconnect();
    },
  };
};

test.concurrent("should create customers", async ({ task }) => {
  const customer1 = { id: "1", name: "John Doe" };
  const customer2 = { id: "2", name: "Jane Doe" };

  await using msSqlServer = await setUpDatabase({ database: task.id });
  await createCustomer(msSqlServer.client, customer1);
  await createCustomer(msSqlServer.client, customer2);

  const customers = await getCustomers(msSqlServer.client);
  expect(customers).toEqual([customer1, customer2]);
});

test.concurrent(
  "should start with 0 customers in the database",
  async ({ task }) => {
    await using msSqlServer = await setUpDatabase({ database: task.id });

    const customers = await getCustomers(msSqlServer.client);
    expect(customers).toEqual([]);
  }
);
