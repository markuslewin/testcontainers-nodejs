import type { Client } from "pg";

export const createCustomerTable = async (client: Client) => {
  // id INT NOT NULL,
  await client.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id BIGINT NOT NULL,
      name VARCHAR NOT NULL,
      PRIMARY KEY (id)
    )
  `);
};

export const createCustomer = async (
  client: Client,
  customer: { id: number; name: string }
) => {
  client.query(
    `
    INSERT INTO customers (id, name)
    VALUES ($1, $2)
  `,
    [customer.id, customer.name]
  );
};

export const getCustomers = async (client: Client) => {
  const sql = `
    SELECT * FROM customers
  `;
  const result = await client.query(sql);
  return result.rows;
};
