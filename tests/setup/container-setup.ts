import { MSSQLServerContainer } from "@testcontainers/mssqlserver";
import { execa } from "execa";

export const setUpDatabase = async () => {
  const container = await new MSSQLServerContainer(
    "mcr.microsoft.com/mssql/server"
  )
    .acceptLicense()
    .start();

  // const connectionString = container.getConnectionUri()
  // JDBC for Prisma
  const connectionString = `sqlserver://${container.getHost()}:${container.getPort()};database=${container.getDatabase()};user=${container.getUsername()};password=${container.getPassword()};encrypt=true;trustServerCertificate=true`;

  await execa({
    env: {
      DATABASE_URL: connectionString,
    },
  })`prisma migrate reset --force --skip-generate --skip-seed`;

  return {
    connectionString,
    stop: async () => {
      await container.stop();
    },
  };
};
