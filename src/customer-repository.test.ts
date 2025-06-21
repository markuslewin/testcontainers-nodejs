import { test, expect } from "vitest";
import { Client } from "pg";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import {
  createCustomerTable,
  createCustomer,
  getCustomers,
} from "./customer-repository";

const setupDatabase = async () => {
  const container = await new PostgreSqlContainer(
    "postgres:13.3-alpine"
  ).start();
  const client = new Client({
    connectionString: container.getConnectionUri(),
  });

  await client.connect();
  await createCustomerTable(client);

  return {
    container,
    client,
    [Symbol.asyncDispose]: async () => {
      await client.end();
      await container.stop();
    },
  };
};

test("should create customers", async () => {
  const customer1 = { id: 1, name: "John Doe" };
  const customer2 = { id: 2, name: "Jane Doe" };

  await using postgres = await setupDatabase();
  await createCustomer(postgres.client, customer1);
  await createCustomer(postgres.client, customer2);

  const customers = await getCustomers(postgres.client);
  expect(customers).toEqual([customer1, customer2]);
});

test("should start with 0 customers in the database", async () => {
  await using postgres = await setupDatabase();

  const customers = await getCustomers(postgres.client);
  expect(customers).toEqual([]);
});
