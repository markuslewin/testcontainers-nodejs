# Testcontainers in Node.js

Example from [Getting started with Testcontainers for Node.js](https://testcontainers.com/guides/getting-started-with-testcontainers-for-nodejs/) modified to use [Vitest](https://vitest.dev/), [Prisma ORM](https://www.prisma.io/orm), and [Microsoft SQL Server](https://hub.docker.com/r/microsoft/mssql-server).

```sh
npm test
```

The tests run in parallel. Each test maintains a connection to its own isolated database contained inside of a globally-shared database server.

## Branch `singleton-client`

The branch `singleton-client` tests an application that doesn't support dependency injecting the `PrismaClient`. In this case, the `PrismaClient` will read the connection string from the environment variable `DATABASE_URL`. For tests to run in parallel, each test needs to run in its own process with its own connection string stored in `DATABASE_URL`.

Vitest doesn't support creating a child process for each test, and so the tests in a file can no longer run [`.concurrent`ly](https://vitest.dev/guide/parallelism.html#test-parallelism). [File Parallelism](https://vitest.dev/guide/parallelism.html#file-parallelism) can still be utilized. The trick is to:

1. Start a Vitest worker (child process)
2. Set `process.env.DATABASE_URL` using [`setupFiles`](https://vitest.dev/config/#setupfiles)
3. Instantiate the `PrismaClient` by running the test

This mirrors the setup seen in [The Epic Stack](https://github.com/epicweb-dev/epic-stack).

Each test file runs on its own database, and each test in a file runs sequentially on a reset database. All tests run on the same database server.

## Other Resources

- [Running Testcontainers Tests Using GitHub Actions and Testcontainers Cloud](https://www.docker.com/blog/running-testcontainers-tests-using-github-actions/)
