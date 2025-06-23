import client from "./client";

export const createCustomer = async (customer: {
  id: string;
  name: string;
}) => {
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

export const getCustomers = async () => {
  return await client.customer.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};
