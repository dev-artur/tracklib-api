# Tracks Library API

[![CI](https://github.com/dev-artur/tracklib-api/actions/workflows/ci.yml/badge.svg)](https://github.com/dev-artur/tracklib-api/actions/workflows/ci.yml)

REST API for a music track library — Fastify, TypeScript, PostgreSQL.

## Requirements

Node.js 22+, Docker

## Running it locally

```bash
# 1. Start Postgres and create the databases
docker run --name tracklib-db -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=tracklib -p 5432:5432 -d postgres:17
docker exec -i tracklib-db psql -U postgres -d tracklib < db/schema.sql
docker exec -it tracklib-db psql -U postgres -c "CREATE DATABASE tracklib_test;"
docker exec -i tracklib-db psql -U postgres -d tracklib_test < db/schema.sql

# 2. Configure and run
cp .env.example .env
npm install
npm run dev
```

## Tests

```bash
npm test              # unit + integration (needs tracklib-db running)
npm run test:ci       # with coverage threshold
```