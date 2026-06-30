# Wach Blog & Portfolio Makefile
# All Node/npm/project commands run inside Docker (see docker-compose.yml).

# Variables
NODE_ENV ?= development
PORT ?= 3000
BROWSER ?= chrome
COVERAGE_THRESHOLD ?= 70
PLAYWRIGHT_WORKERS ?= 50%
BASE_PATH ?=
EXPORT ?=
DOCKER_COMPOSE := docker compose
APP_SERVICE := app
IMAGE_TAG := wach-blog

# Windows environment setup (volume mounts)
ifeq ($(OS),Windows_NT)
    PWD := $(shell pwd)
    export PWD
endif

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
PURPLE := \033[0;35m
CYAN := \033[0;36m
WHITE := \033[0;37m
RESET := \033[0m

# Default target
.DEFAULT_GOAL := help

# Run a command in the app container (starts db + minio via depends_on)
define run_app
	$(DOCKER_COMPOSE) run --rm $(APP_SERVICE) $(1)
endef

# Start Postgres + MinIO (required before some profile runs)
.PHONY: docker-infra
docker-infra: ## Start Postgres and MinIO infrastructure
	@echo "$(GREEN)Starting Postgres and MinIO...$(RESET)"
	$(DOCKER_COMPOSE) up -d db minio
	$(DOCKER_COMPOSE) up minio-init

# Help target
.PHONY: help
help: ## Show this help message
	@echo "$(CYAN)Wach Blog & Portfolio - Available Commands (Docker):$(RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Environment Variables:$(RESET)"
	@echo "  NODE_ENV              - Set to 'production' for production builds (default: development)"
	@echo "  PORT                  - Development server port (default: 3000)"
	@echo "  BROWSER               - Browser for E2E tests (default: chrome)"
	@echo "  COVERAGE_THRESHOLD    - Test coverage threshold (default: 70)"
	@echo "  PLAYWRIGHT_WORKERS    - E2E parallel workers (default: 50%)"
	@echo "  BASE_PATH             - Base path for static export (build-static-path)"
	@echo ""

# Development
.PHONY: dev
dev: ## Start development server (Docker Compose)
	@echo "$(GREEN)Starting development server in Docker...$(RESET)"
	$(DOCKER_COMPOSE) up $(APP_SERVICE)

.PHONY: dev-port
dev-port: ## Start development server on custom port
	@echo "$(GREEN)Starting development server on port $(PORT) in Docker...$(RESET)"
	$(DOCKER_COMPOSE) run --rm -p $(PORT):3000 $(APP_SERVICE) npm run dev -- --hostname 0.0.0.0 --port 3000

.PHONY: dev-cross
dev-cross: dev ## Cross-platform development server (Docker)

# Installation
.PHONY: install
install: ## Install dependencies in Docker volume
	@echo "$(GREEN)Installing dependencies in Docker...$(RESET)"
	$(call run_app,npm ci --ignore-scripts)
	$(call run_app,npx prisma generate)

.PHONY: install-clean
install-clean: ## Clean install dependencies in Docker
	@echo "$(GREEN)Cleaning and reinstalling dependencies in Docker...$(RESET)"
	rm -rf .docker/node_modules
	$(MAKE) install

# Building
.PHONY: build
build: ## Build for production
	@echo "$(GREEN)Building for production in Docker...$(RESET)"
	$(call run_app,sh -c "NODE_ENV=production npm run build")

.PHONY: build-dev
build-dev: ## Build for development
	@echo "$(GREEN)Building for development in Docker...$(RESET)"
	$(call run_app,npm run build)

.PHONY: build-static
build-static: ## Build static export
	@echo "$(GREEN)Building static export in Docker...$(RESET)"
	$(call run_app,sh -c "EXPORT=1 UNOPTIMIZED=1 npm run build")

.PHONY: build-static-path
build-static-path: ## Build static export with base path (set BASE_PATH=/myblog)
	@echo "$(GREEN)Building static export with base path in Docker...$(RESET)"
	@if [ -z "$(BASE_PATH)" ]; then \
		echo "$(RED)Set BASE_PATH, e.g. make build-static-path BASE_PATH=/myblog$(RESET)"; \
		exit 1; \
	fi
	$(call run_app,sh -c "EXPORT=1 UNOPTIMIZED=1 BASE_PATH=$(BASE_PATH) npm run build")

# Serving
.PHONY: serve
serve: ## Start production server
	@echo "$(GREEN)Starting production server in Docker...$(RESET)"
	$(DOCKER_COMPOSE) run --rm -p $(PORT):3000 $(APP_SERVICE) npm run serve -- --hostname 0.0.0.0 --port 3000

.PHONY: serve-port
serve-port: serve ## Start production server on custom port

# Testing
.PHONY: test
test: docker-infra ## Run unit + integration tests in Docker
	@echo "$(GREEN)Running unit + integration tests in Docker...$(RESET)"
	$(DOCKER_COMPOSE) --profile test run --rm --build test

.PHONY: test-watch
test-watch: ## Run tests in watch mode (interactive)
	@echo "$(GREEN)Running tests in watch mode in Docker...$(RESET)"
	$(DOCKER_COMPOSE) run --rm -it $(APP_SERVICE) npm run test:watch

.PHONY: test-coverage
test-coverage: docker-infra ## Run tests with coverage report
	@echo "$(GREEN)Running tests with coverage in Docker...$(RESET)"
	$(call run_app,npm run test:coverage)

.PHONY: test-ci
test-ci: test ## Run tests for CI environment

.PHONY: test-e2e
test-e2e: docker-infra ## Run full E2E suite in Docker
	@echo "$(GREEN)Building E2E images...$(RESET)"
	$(DOCKER_COMPOSE) --profile e2e build app-e2e e2e
	@echo "$(GREEN)Starting app-e2e (seed + production server)...$(RESET)"
	$(DOCKER_COMPOSE) --profile e2e up -d --force-recreate --wait app-e2e
	@echo "$(GREEN)Running E2E tests in Docker ($(PLAYWRIGHT_WORKERS) workers)...$(RESET)"
	$(DOCKER_COMPOSE) --profile e2e run --rm -e PLAYWRIGHT_WORKERS=$(PLAYWRIGHT_WORKERS) e2e

.PHONY: test-e2e-run
test-e2e-run: ## Run E2E tests against running app-e2e stack
	@echo "$(GREEN)Running E2E tests in Docker ($(PLAYWRIGHT_WORKERS) workers)...$(RESET)"
	$(DOCKER_COMPOSE) --profile e2e run --rm -e PLAYWRIGHT_WORKERS=$(PLAYWRIGHT_WORKERS) e2e

.PHONY: test-e2e-ui
test-e2e-ui: ## Run E2E tests with UI mode (requires local display)
	@echo "$(YELLOW)UI mode requires X11/display forwarding; starting interactive E2E container...$(RESET)"
	$(DOCKER_COMPOSE) --profile e2e run --rm -it e2e npm run test:e2e:ui

.PHONY: test-e2e-headed
test-e2e-headed: ## Run E2E tests in headed mode (requires local display)
	$(DOCKER_COMPOSE) --profile e2e run --rm -it e2e npm run test:e2e:headed

.PHONY: test-e2e-debug
test-e2e-debug: ## Run E2E tests in debug mode (requires local display)
	$(DOCKER_COMPOSE) --profile e2e run --rm -it e2e npm run test:e2e:debug

.PHONY: test-e2e-install
test-e2e-install: ## Build E2E image (Playwright browsers baked in)
	@echo "$(GREEN)Building E2E Docker image (includes Playwright browsers)...$(RESET)"
	$(DOCKER_COMPOSE) --profile e2e build e2e

.PHONY: test-e2e-report
test-e2e-report: ## Show E2E test report
	@echo "$(GREEN)Opening E2E test report in Docker...$(RESET)"
	$(DOCKER_COMPOSE) --profile e2e run --rm -p 9323:9323 e2e npm run test:e2e:report

.PHONY: test-down
test-down: ## Stop test profile containers
	$(DOCKER_COMPOSE) --profile test down

.PHONY: test-e2e-down
test-e2e-down: ## Stop E2E profile containers
	$(DOCKER_COMPOSE) --profile e2e down

# Linting and Code Quality
.PHONY: lint
lint: ## Run ESLint
	@echo "$(GREEN)Running ESLint in Docker...$(RESET)"
	$(call run_app,npm run lint)

.PHONY: lint-fix
lint-fix: ## Run ESLint with auto-fix
	@echo "$(GREEN)Running ESLint with auto-fix in Docker...$(RESET)"
	$(call run_app,npm run lint -- --fix)

.PHONY: format
format: ## Format code with Prettier
	@echo "$(GREEN)Formatting code in Docker...$(RESET)"
	$(call run_app,npx prettier --write .)

.PHONY: format-check
format-check: ## Check code formatting
	@echo "$(GREEN)Checking code formatting in Docker...$(RESET)"
	$(call run_app,npx prettier --check .)

.PHONY: format-lint
format-lint: ## Format with Prettier and fix ESLint issues
	@echo "$(GREEN)Formatting and lint-fixing in Docker...$(RESET)"
	$(MAKE) format
	$(MAKE) lint-fix

.PHONY: format-lint-check
format-lint-check: ## Check formatting and lint (no writes)
	@echo "$(GREEN)Checking format and lint in Docker...$(RESET)"
	$(MAKE) format-check
	$(MAKE) lint

# Analysis
.PHONY: analyze
analyze: ## Analyze bundle size
	@echo "$(GREEN)Analyzing bundle size in Docker...$(RESET)"
	$(call run_app,npm run analyze)

.PHONY: type-check
type-check: ## Run TypeScript type checking
	@echo "$(GREEN)Running TypeScript type checking in Docker...$(RESET)"
	$(call run_app,npm run typecheck)

.PHONY: validate
validate: ## Run lint, typecheck, and unit tests
	@echo "$(GREEN)Running validate in Docker...$(RESET)"
	$(call run_app,npm run validate)

# Database
.PHONY: db-push
db-push: docker-infra ## Push Prisma schema to database
	$(call run_app,npx prisma db push)

.PHONY: db-seed
db-seed: docker-infra ## Seed database
	$(call run_app,npx prisma db seed)

.PHONY: db-migrate
db-migrate: docker-infra ## Run Prisma migrations
	$(call run_app,npx prisma migrate dev)

.PHONY: db-studio
db-studio: docker-infra ## Open Prisma Studio
	$(DOCKER_COMPOSE) run --rm -p 5555:5555 $(APP_SERVICE) npx prisma studio --hostname 0.0.0.0 --port 5555

# Content Management
.PHONY: rss
rss: ## Generate RSS feed
	@echo "$(GREEN)Generating RSS feed in Docker...$(RESET)"
	$(call run_app,node scripts/rss.mjs)

.PHONY: sitemap
sitemap: build-dev ## Generate sitemap (via Next.js build)

# GitHub Cache Management
.PHONY: github-cache-refresh
github-cache-refresh: ## Refresh GitHub repositories cache
	@echo "$(GREEN)Refreshing GitHub repositories cache in Docker...$(RESET)"
	$(call run_app,node scripts/refresh-github-cache.mjs)

.PHONY: github-cache-clear
github-cache-clear: ## Clear GitHub repositories cache
	@echo "$(GREEN)Clearing GitHub repositories cache...$(RESET)"
	@rm -f data/github-repos-cache.json
	@echo "$(YELLOW)Cache cleared$(RESET)"

.PHONY: github-cache-status
github-cache-status: ## Show GitHub cache status
	@echo "$(GREEN)Checking GitHub cache status...$(RESET)"
	@if [ -f data/github-repos-cache.json ]; then \
		echo "$(GREEN)Cache file exists$(RESET)"; \
		echo "Size: $$(ls -lh data/github-repos-cache.json | awk '{print $$5}')"; \
		echo "Last modified: $$(stat -c %y data/github-repos-cache.json 2>/dev/null || stat -f %Sm data/github-repos-cache.json 2>/dev/null || echo 'Unknown')"; \
	else \
		echo "$(YELLOW)No cache file found$(RESET)"; \
	fi

# License Management
.PHONY: license-headers
license-headers: ## Add proprietary license headers to all source files
	@echo "$(GREEN)Adding proprietary license headers in Docker...$(RESET)"
	$(call run_app,node scripts/add-license-headers.mjs)

.PHONY: license-check
license-check: ## Check which files have license headers
	@echo "$(GREEN)Checking license headers in Docker...$(RESET)"
	@$(call run_app,sh -c "find . -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.mjs' | grep -v node_modules | grep -v .next | xargs grep -l 'PROPRIETARY LICENSE' | wc -l | xargs echo 'Files with license headers:'")

# Docker
.PHONY: docker-build
docker-build: ## Build production Docker image
	@echo "$(GREEN)Building production Docker image...$(RESET)"
	docker build -t $(IMAGE_TAG) --target production .

.PHONY: docker-build-dev
docker-build-dev: ## Build development Docker image
	@echo "$(GREEN)Building development Docker image...$(RESET)"
	$(DOCKER_COMPOSE) build $(APP_SERVICE)

.PHONY: docker-run
docker-run: ## Run production Docker container
	@echo "$(GREEN)Running production Docker container...$(RESET)"
	docker run -p $(PORT):3000 $(IMAGE_TAG)

.PHONY: docker-compose-up
docker-compose-up: ## Start Docker Compose services (db, minio, app)
	@echo "$(GREEN)Starting Docker Compose services...$(RESET)"
	$(DOCKER_COMPOSE) up -d

.PHONY: docker-compose-down
docker-compose-down: ## Stop Docker Compose services
	@echo "$(GREEN)Stopping Docker Compose services...$(RESET)"
	$(DOCKER_COMPOSE) down

.PHONY: docker-logs
docker-logs: ## Follow app container logs
	$(DOCKER_COMPOSE) logs -f $(APP_SERVICE)

# Cleaning
.PHONY: clean
clean: ## Clean build artifacts
	@echo "$(GREEN)Cleaning build artifacts...$(RESET)"
	rm -rf .next out dist coverage .nyc_output playwright-report test-results

.PHONY: clean-all
clean-all: clean ## Clean all generated files including Docker node_modules
	@echo "$(GREEN)Cleaning Docker node_modules volume...$(RESET)"
	rm -rf .docker/node_modules

# Security
.PHONY: audit
audit: ## Run security audit
	@echo "$(GREEN)Running security audit in Docker...$(RESET)"
	$(call run_app,npm audit)

.PHONY: audit-fix
audit-fix: ## Fix security vulnerabilities
	@echo "$(GREEN)Fixing security vulnerabilities in Docker...$(RESET)"
	$(call run_app,npm audit fix)

# Performance
.PHONY: lighthouse
lighthouse: ## Run Lighthouse performance audit (requires app on localhost:$(PORT))
	@echo "$(GREEN)Running Lighthouse audit via Docker...$(RESET)"
	docker run --rm --network host -v "$(PWD):/work" -w /work node:lts-alpine \
		sh -c "npm install -g lighthouse && lighthouse http://host.docker.internal:$(PORT) --output html --output-path ./lighthouse-report.html"

# Development Workflow
.PHONY: setup
setup: ## Complete development setup (Docker)
	@echo "$(GREEN)Setting up development environment in Docker...$(RESET)"
	$(MAKE) docker-infra
	$(MAKE) install
	$(MAKE) db-push
	$(MAKE) db-seed
	$(MAKE) test-e2e-install
	@echo "$(GREEN)Setup complete! Run 'make dev' or 'make docker-compose-up' to start.$(RESET)"

.PHONY: check
check: ## Run all checks (lint, test, build)
	@echo "$(GREEN)Running all checks in Docker...$(RESET)"
	$(MAKE) lint
	$(MAKE) type-check
	$(MAKE) test
	$(MAKE) build-dev
	@echo "$(GREEN)All checks passed!$(RESET)"

.PHONY: pre-commit
pre-commit: ## Run pre-commit checks
	@echo "$(GREEN)Running pre-commit checks in Docker...$(RESET)"
	$(MAKE) format
	$(MAKE) lint-fix
	$(MAKE) type-check
	$(MAKE) test
	@echo "$(GREEN)Pre-commit checks completed!$(RESET)"

# Production Workflow
.PHONY: deploy-prep
deploy-prep: ## Prepare for deployment
	@echo "$(GREEN)Preparing for deployment in Docker...$(RESET)"
	$(MAKE) clean
	$(MAKE) install
	$(MAKE) lint
	$(MAKE) type-check
	$(MAKE) test
	$(MAKE) build
	@echo "$(GREEN)Deployment preparation complete!$(RESET)"

.PHONY: deploy-static
deploy-static: ## Deploy static build
	@echo "$(GREEN)Deploying static build in Docker...$(RESET)"
	$(MAKE) build-static
	@echo "$(GREEN)Static build ready in 'out' directory!$(RESET)"

# Monitoring and Logs
.PHONY: logs
logs: docker-logs ## Show application logs

.PHONY: status
status: ## Show project status
	@echo "$(CYAN)Project Status (Docker):$(RESET)"
	@echo "Docker Compose: $$($(DOCKER_COMPOSE) version 2>/dev/null | head -1 || echo 'not available')"
	@echo "Node.js (container): $$($(DOCKER_COMPOSE) run --rm --no-deps $(APP_SERVICE) node --version 2>/dev/null || echo 'build app image first: make docker-build-dev')"
	@echo "npm (container): $$($(DOCKER_COMPOSE) run --rm --no-deps $(APP_SERVICE) npm --version 2>/dev/null || echo 'n/a')"
	@$(DOCKER_COMPOSE) ps 2>/dev/null || true

# Utility
.PHONY: update-deps
update-deps: ## Update dependencies (interactive, in Docker)
	@echo "$(GREEN)Updating dependencies in Docker...$(RESET)"
	$(DOCKER_COMPOSE) run --rm -it $(APP_SERVICE) npm update

.PHONY: outdated
outdated: ## Check for outdated dependencies
	@echo "$(GREEN)Checking for outdated dependencies in Docker...$(RESET)"
	$(call run_app,npm outdated)

.PHONY: size
size: ## Check project size
	@echo "$(GREEN)Checking project size...$(RESET)"
	@du -sh . --exclude=node_modules --exclude=.git --exclude=.next --exclude=out --exclude=.docker 2>/dev/null || du -sh .

# Windows-specific
.PHONY: windows-setup
windows-setup: setup ## Windows-specific setup (Docker)

.PHONY: windows-dev
windows-dev: dev ## Windows development server (Docker)

# Documentation
.PHONY: docs
docs: ## Generate documentation
	@echo "$(GREEN)Generating documentation in Docker...$(RESET)"
	$(call run_app,sh -c "if command -v jsdoc >/dev/null 2>&1; then jsdoc -c jsdoc.json; else npx jsdoc -c jsdoc.json; fi")

# Backup and Restore
.PHONY: backup
backup: ## Create backup of content
	@echo "$(GREEN)Creating backup...$(RESET)"
	@tar -czf backup-$(shell date +%Y%m%d-%H%M%S).tar.gz \
		--exclude=node_modules \
		--exclude=.docker \
		--exclude=.next \
		--exclude=out \
		--exclude=.git \
		src/data/ \
		public/ \
		src/components/ \
		src/app/

.PHONY: restore
restore: ## Restore from backup
	@echo "$(GREEN)Restoring from backup...$(RESET)"
	@read -p "Enter backup filename: " backup_file; \
	tar -xzf $$backup_file

# Show available targets
.PHONY: targets
targets: help ## Show all available targets
