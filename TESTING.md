# Testing strategy

This document describes how I test tracklib-api: which kinds of tests I use, why, what I deliberately don't test, and what comes next.

## 1. Kinds of tests

- **5 unit tests** for `format.ts`, covering track duration formatting.
- **5 route validation tests.** They run through Fastify's full request pipeline via `inject` but never touch the database, so they live in my fast tier.
- **8 integration tests** covering the CRUD routes against a real Postgres.
- **2 e2e tests** with Playwright on the frontend UI.

## 2. Why each layer

- **Unit:** duration formatting is a pure function, so a unit test is the cheapest way to catch formatting errors and edge cases.
- **Route validation:** these tests catch JSON schema rules, type coercion and a clear 400 response. They don't need a database, so they stay fast.
- **Integration:** CRUD tests need a real database because I want to catch SQL errors and mistakes in how I work with the database.
- **E2E:** these scenarios must be checked in a real browser. They catch problems in the connection between the frontend, the proxy and the server, which no `inject` test can see.

## 3. What I don't test

I don't test the empty state end-to-end. The test database is shared between parallel workers and is never empty after the first run, so the scenario can't be reproduced without clearing the database, which would race with other tests. Empty-state rendering will be covered by a TrackList component test (Testing Library).

## 4. Test data isolation

- Tests use a separate `tracklib_test` database with the same schema as the dev database, so test runs never pollute dev data.
- A guard refuses to run integration tests if `DATABASE_URL` doesn't point to a test database, so `TRUNCATE` can never wipe real data.
- Every integration test starts with `TRUNCATE`, so it begins from a known empty state and doesn't depend on leftovers from other tests or on execution order.
- `fileParallelism: false` runs test files one by one, so a `TRUNCATE` in one file can't wipe data that a test in another file is using.
- E2E tests don't truncate. Each test creates a track with a unique title and checks only its own data, so parallel workers don't interfere.

## 5. Real Postgres instead of mocks

I test against a real Postgres because most of my bugs would live in SQL and database behavior (NULL defaults, ordering, rowCount). A mock would only confirm my own assumptions about the database. The cost is slower tests and a Postgres service in CI, which I accept.

## 6. CI

On the main branch I set up rules: merge only through a PR, the test check is required, and force push is forbidden. On each PR, CI runs ESLint on `src`, type-checks with `tsc`, starts Postgres 17 with the schema and runs all tests except e2e with an 80% coverage threshold.

80% coverage doesn't mean 80% tested: a covered line can have no assertion, the threshold ignores branches, and it says nothing about the frontend or frontend–API integration.

## 7. Next steps

- TrackList component tests (Testing Library) and a unit test for the Redux slice.
- E2E tests in CI as a separate job.
