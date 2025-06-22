import { PrismaClient } from "../generated/prisma";

export const createCustomer = async (
  client: PrismaClient,
  customer: { id: string; name: string }
) => {
  return await client.customer.create({
    data: {
      id: customer.id,
      name: customer.name,
    },
    select: {
      id: true,
    },
  });
};

export const getCustomers = async (client: PrismaClient) => {
  return await client.customer.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};
