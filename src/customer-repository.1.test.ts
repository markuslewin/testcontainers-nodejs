import { createCustomer, getCustomers } from "./customer-repository";
import { test } from "../tests/setup/extended-test";
import { expect } from "vitest";

test.concurrent("should create customers", async ({ prisma }) => {
  const customer1 = { id: "1", name: "Three" };
  const customer2 = { id: "2", name: "Four" };

  await createCustomer(prisma, customer1);
  await createCustomer(prisma, customer2);

  const customers = await getCustomers(prisma);
  expect(customers).toEqual([customer1, customer2]);
});

test.concurrent(
  "should start with 0 customers in the database",
  async ({ prisma }) => {
    const customers = await getCustomers(prisma);
    expect(customers).toEqual([]);
  }
);
