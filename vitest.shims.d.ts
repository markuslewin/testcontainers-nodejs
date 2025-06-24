import { Container, key } from "./tests/setup/global-setup";

declare module "vitest" {
  export interface ProvidedContext {
    MSSQLServerContainer:
      | {
          host: string;
          port: number;
          username: string;
          password: string;
        }
      | undefined;
  }
}

// mark this file as a module so augmentation works correctly
export {};
