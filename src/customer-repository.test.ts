import { test, expect } from "vitest";
import { MSSQLServerContainer } from "@testcontainers/mssqlserver";
import { createCustomer, getCustomers } from "./customer-repository";
import { PrismaClient } from "../generated/prisma";
import { execa } from "execa";

const setUpDatabase = async () => {
  const container = await new MSSQLServerContainer(
    "mcr.microsoft.com/mssql/server"
  )
    .acceptLicense()
    .start();

  // const connectionString = container.getConnectionUri()
  // JDBC for Prisma
  const connectionString = `sqlserver://${container.getHost()}:${container.getPort()};database=${container.getDatabase()};user=${container.getUsername()};password=${container.getPassword()};encrypt=true;trustServerCertificate=true`;

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
  const customer1 = { id: "1", name: "John Doe" };
  const customer2 = { id: "2", name: "Jane Doe" };

  await using mssqlserver = await setUpDatabase();
  await createCustomer(mssqlserver.client, customer1);
  await createCustomer(mssqlserver.client, customer2);

  const customers = await getCustomers(mssqlserver.client);
  expect(customers).toEqual([customer1, customer2]);
});

test.concurrent("should start with 0 customers in the database", async () => {
  await using mssqlserver = await setUpDatabase();

  const customers = await getCustomers(mssqlserver.client);
  expect(customers).toEqual([]);
});
