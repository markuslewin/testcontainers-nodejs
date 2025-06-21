import { test, expect } from "vitest";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { createCustomer, getCustomers } from "./customer-repository";
import { PrismaClient } from "../generated/prisma";
import { execa } from "execa";

const setUpDatabase = async () => {
  const container = await new PostgreSqlContainer("postgres").start();
  const connectionString = container.getConnectionUri();

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
      await container.stop();
    },
  };
};

test.concurrent("should create customers", async () => {
  const customer1 = { id: 1, name: "John Doe" };
  const customer2 = { id: 2, name: "Jane Doe" };

  await using postgres = await setUpDatabase();
  await createCustomer(postgres.client, customer1);
  await createCustomer(postgres.client, customer2);

  const customers = await getCustomers(postgres.client);
  expect(customers).toEqual([customer1, customer2]);
});

test.concurrent("should start with 0 customers in the database", async () => {
  await using postgres = await setUpDatabase();

  const customers = await getCustomers(postgres.client);
  expect(customers).toEqual([]);
});
