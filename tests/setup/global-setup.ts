import {
  MSSQLServerContainer,
  StartedMSSQLServerContainer,
} from "@testcontainers/mssqlserver";
import { inject } from "vitest";
import { TestProject } from "vitest/node";

let container: StartedMSSQLServerContainer | undefined;

export const setup = async (project: TestProject) => {
  container = await new MSSQLServerContainer("mcr.microsoft.com/mssql/server")
    .acceptLicense()
    .start();

  project.provide("MSSQLServerContainer", {
    host: container.getHost(),
    port: container.getPort(),
    username: container.getUsername(),
    password: container.getPassword(),
  });
};

export const teardown = () => {
  container?.stop();
};

export const msSqlServerContainerInject = () => {
  const container = inject("MSSQLServerContainer");
  if (!container) {
    throw new Error("Container not found");
  }
  return container;
};
