import { inject } from "vitest";

export const msSqlServerContainerInject = () => {
  const container = inject("MSSQLServerContainer");
  if (!container) {
    throw new Error("Container not found");
  }
  return container;
};
