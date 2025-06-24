import { prisma } from "./prisma";

export const createCustomer = async (customer: {
  id: string;
  name: string;
}) => {
  return await prisma.customer.create({
    data: {
      id: customer.id,
      name: customer.name,
    },
    select: {
      id: true,
    },
  });
};

export const getCustomers = async () => {
  return await prisma.customer.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};
