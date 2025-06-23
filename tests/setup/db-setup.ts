import { afterAll } from "vitest";
import { setUpDatabase } from "./container-setup";

const mssqlserver = await setUpDatabase();
process.env.DATABASE_URL = mssqlserver.connectionString;

afterAll(() => {
  mssqlserver.stop();
});
