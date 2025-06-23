import { test, expect } from "vitest";
import { createCustomer, getCustomers } from "./customer-repository";

test("should create customers", async () => {
  const customer1 = { id: "1", name: "John Doe" };
  const customer2 = { id: "2", name: "Jane Doe" };

  await createCustomer(customer1);
  await createCustomer(customer2);

  const customers = await getCustomers();
  expect(customers).toEqual([customer1, customer2]);
});
