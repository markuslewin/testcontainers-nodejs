import { createCustomer, getCustomers } from "./customer-repository";
import { test, expect } from "vitest";

test("should create customers", async () => {
  const customer1 = { id: "1", name: "One" };
  const customer2 = { id: "2", name: "Two" };

  await createCustomer(customer1);
  await createCustomer(customer2);

  const customers = await getCustomers();
  expect(customers).toEqual([customer1, customer2]);
});

test("should start with 0 customers in the database", async () => {
  const customers = await getCustomers();
  expect(customers).toEqual([]);
});
