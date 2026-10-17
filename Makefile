# Developer entry points. `make` alone lists them.
# Recipes are plain shell, so everything here can also be typed by hand.

.DEFAULT_GOAL := help
.PHONY: help setup db db-stop be fe test test-be test-fe check check-be check-fe

help: ## List the targets
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "} {printf "  %-10s %s\n", $$1, $$2}'

setup: ## First-time setup: toolchain, database, backend and frontend dependencies
	mise install
	$(MAKE) db
	cd backend && mix local.hex --force && mix local.rebar --force && mix setup
	cd frontend && npm ci

db: ## Start Postgres and wait until it accepts connections
	docker compose up -d --wait

db-stop: ## Stop Postgres (the data volume is kept)
	docker compose stop db

be: db ## Run the Phoenix API on http://localhost:4000
	cd backend
# && mix phx.server

fe: ## Run the Vite dev server on http://localhost:5173 (proxies /api to :4000)
	cd frontend && npm run dev

test: test-be test-fe ## Run every test suite

test-be: db
	cd backend && mix test

test-fe:
	cd frontend && npm test

# `check` changes nothing and fails on any violation: what CI would run.
# For the backend, `cd backend && mix precommit` is the variant that fixes what it can first.
check: check-be check-fe ## Format, lint, type-check and test everything, without modifying files

check-be: db
	cd backend && mix check

check-fe:
	cd frontend && npm run format:check && npm run lint && npm run typecheck && npm test && npm run build
