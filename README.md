# Testcontainers in Node.js

Example from [Getting started with Testcontainers for Node.js](https://testcontainers.com/guides/getting-started-with-testcontainers-for-nodejs/) modified to use [Vitest](https://vitest.dev/), [Prisma ORM](https://www.prisma.io/orm), and [Microsoft SQL Server](https://hub.docker.com/r/microsoft/mssql-server).

```sh
npm test
```

The tests run in parallel. Each test maintains a connection to its own isolated database contained inside of a globally-shared database server.

## Other Resources

- [Running Testcontainers Tests Using GitHub Actions and Testcontainers Cloud](https://www.docker.com/blog/running-testcontainers-tests-using-github-actions/)
