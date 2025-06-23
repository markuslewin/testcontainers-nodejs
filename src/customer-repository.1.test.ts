import { test, expect } from "vitest";
import { getCustomers } from "./customer-repository";

test("should start with 0 customers in the database", async () => {
  const customers = await getCustomers();
  expect(customers).toEqual([]);
});
