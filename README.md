# elix-climbing

A climbing app, built as a vehicle for learning Elixir / OTP / Phoenix (backend) and
React / TypeScript (frontend).

## Layout

| Path        | What                                              |
|-------------|---------------------------------------------------|
| `backend/`  | Phoenix JSON API (Elixir/OTP)                     |
| `frontend/` | Vite + React + TypeScript SPA                     |

## Prerequisites

- [mise](https://mise.jdx.dev) — installs the pinned toolchain from `mise.toml`
- Docker + Docker Compose — runs Postgres

## Getting started

```sh
make setup   # toolchain, Postgres, backend and frontend dependencies
make be      # terminal 1: Phoenix API on http://localhost:4000
make fe      # terminal 2: Vite dev server on http://localhost:5173
```

Open http://localhost:5173. The page shows the API status; in dev, Vite proxies `/api` to
Phoenix, so the browser only ever talks to one origin (no CORS setup needed).

## Day to day

| Command                    | What it does                                                          |
|----------------------------|-----------------------------------------------------------------------|
| `make test`                | Backend (ExUnit) and frontend (Vitest) tests                          |
| `make check`               | Format check, lint, types and tests, changing nothing: what CI runs   |
| `cd backend && mix precommit` | Like `check` for the backend, but fixes formatting first           |
| `make db-stop`             | Stop Postgres (data kept in the `pgdata` volume)                      |

`make` alone lists every target. The first `mix dialyzer` builds a type cache and takes several
minutes; later runs take seconds.
