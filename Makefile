# Wach Blog & Portfolio Makefile
# A comprehensive build system for Next.js blog with TypeScript and Tailwind CSS

# Variables
NODE_ENV ?= development
PORT ?= 3000
BROWSER ?= chrome
COVERAGE_THRESHOLD ?= 70

# Windows environment setup
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

# Help target
.PHONY: help
help: ## Show this help message
	@echo "$(CYAN)Wach Blog & Portfolio - Available Commands:$(RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Environment Variables:$(RESET)"
	@echo "  NODE_ENV              - Set to 'production' for production builds (default: development)"
	@echo "  PORT                  - Development server port (default: 3000)"
	@echo "  BROWSER               - Browser for E2E tests (default: chrome)"
	@echo "  COVERAGE_THRESHOLD    - Test coverage threshold (default: 70)"
	@echo ""

# Development
.PHONY: dev
dev: ## Start development server
	@echo "$(GREEN)Starting development server...$(RESET)"
	yarn dev

.PHONY: dev-port
dev-port: ## Start development server on custom port
	@echo "$(GREEN)Starting development server on port $(PORT)...$(RESET)"
	PORT=$(PORT) yarn dev

.PHONY: dev-cross
dev-cross: ## Cross-platform development server (auto-detects OS)
	@echo "$(GREEN)Starting cross-platform development server...$(RESET)"
	yarn dev

# Installation
.PHONY: install
install: ## Install dependencies
	@echo "$(GREEN)Installing dependencies...$(RESET)"
	yarn install

.PHONY: install-clean
install-clean: ## Clean install dependencies
	@echo "$(GREEN)Cleaning and reinstalling dependencies...$(RESET)"
	rm -rf node_modules yarn.lock
	yarn install

# Building
.PHONY: build
build: ## Build for production
	@echo "$(GREEN)Building for production...$(RESET)"
	NODE_ENV=production yarn build

.PHONY: build-dev
build-dev: ## Build for development
	@echo "$(GREEN)Building for development...$(RESET)"
	yarn build

.PHONY: build-static
build-static: ## Build static export
	@echo "$(GREEN)Building static export...$(RESET)"
	EXPORT=1 UNOPTIMIZED=1 yarn build

.PHONY: build-static-path
build-static-path: ## Build static export with base path
	@echo "$(GREEN)Building static export with base path...$(RESET)"
	@read -p "Enter base path (e.g., /myblog): " base_path; \
	EXPORT=1 UNOPTIMIZED=1 BASE_PATH=$$base_path yarn build

# Serving
.PHONY: serve
serve: ## Start production server
	@echo "$(GREEN)Starting production server...$(RESET)"
	yarn serve

.PHONY: serve-port
serve-port: ## Start production server on custom port
	@echo "$(GREEN)Starting production server on port $(PORT)...$(RESET)"
	PORT=$(PORT) yarn serve

# Testing
.PHONY: test
test: ## Run all tests
	@echo "$(GREEN)Running all tests...$(RESET)"
	yarn test

.PHONY: test-watch
test-watch: ## Run tests in watch mode
	@echo "$(GREEN)Running tests in watch mode...$(RESET)"
	yarn test:watch

.PHONY: test-coverage
test-coverage: ## Run tests with coverage report
	@echo "$(GREEN)Running tests with coverage...$(RESET)"
	yarn test:coverage

.PHONY: test-ci
test-ci: ## Run tests for CI environment
	@echo "$(GREEN)Running CI tests...$(RESET)"
	yarn test:ci

.PHONY: test-e2e
test-e2e: ## Run E2E tests
	@echo "$(GREEN)Running E2E tests...$(RESET)"
	yarn test:e2e

.PHONY: test-e2e-ui
test-e2e-ui: ## Run E2E tests with UI mode
	@echo "$(GREEN)Running E2E tests with UI...$(RESET)"
	yarn test:e2e:ui

.PHONY: test-e2e-headed
test-e2e-headed: ## Run E2E tests in headed mode
	@echo "$(GREEN)Running E2E tests in headed mode...$(RESET)"
	yarn test:e2e:headed

.PHONY: test-e2e-debug
test-e2e-debug: ## Run E2E tests in debug mode
	@echo "$(GREEN)Running E2E tests in debug mode...$(RESET)"
	yarn test:e2e:debug

.PHONY: test-e2e-install
test-e2e-install: ## Install Playwright browsers
	@echo "$(GREEN)Installing Playwright browsers...$(RESET)"
	yarn test:e2e:install

.PHONY: test-e2e-report
test-e2e-report: ## Show E2E test report
	@echo "$(GREEN)Opening E2E test report...$(RESET)"
	yarn test:e2e:report

# Linting and Code Quality
.PHONY: lint
lint: ## Run ESLint
	@echo "$(GREEN)Running ESLint...$(RESET)"
	yarn lint

.PHONY: lint-fix
lint-fix: ## Run ESLint with auto-fix
	@echo "$(GREEN)Running ESLint with auto-fix...$(RESET)"
	yarn lint --fix

.PHONY: format
format: ## Format code with Prettier
	@echo "$(GREEN)Formatting code...$(RESET)"
	yarn prettier --write .

.PHONY: format-check
format-check: ## Check code formatting
	@echo "$(GREEN)Checking code formatting...$(RESET)"
	yarn prettier --check .

# Analysis
.PHONY: analyze
analyze: ## Analyze bundle size
	@echo "$(GREEN)Analyzing bundle size...$(RESET)"
	yarn analyze

.PHONY: type-check
type-check: ## Run TypeScript type checking
	@echo "$(GREEN)Running TypeScript type checking...$(RESET)"
	yarn tsc --noEmit

# Content Management
.PHONY: rss
rss: ## Generate RSS feed
	@echo "$(GREEN)Generating RSS feed...$(RESET)"
	node scripts/rss.mjs

.PHONY: sitemap
sitemap: ## Generate sitemap
	@echo "$(GREEN)Generating sitemap...$(RESET)"
	yarn build

# GitHub Cache Management
.PHONY: github-cache-refresh
github-cache-refresh: ## Refresh GitHub repositories cache
	@echo "$(GREEN)Refreshing GitHub repositories cache...$(RESET)"
	@node scripts/refresh-github-cache.mjs

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
	@echo "$(GREEN)Adding proprietary license headers to source files...$(RESET)"
	@node scripts/add-license-headers.mjs

.PHONY: license-check
license-check: ## Check which files have license headers
	@echo "$(GREEN)Checking license headers in source files...$(RESET)"
	@find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.mjs" | grep -v node_modules | grep -v .next | xargs grep -l "PROPRIETARY LICENSE" | wc -l | xargs echo "Files with license headers:"

# Docker
.PHONY: docker-build
docker-build: ## Build Docker image
	@echo "$(GREEN)Building Docker image...$(RESET)"
	docker build -t wach-blog .

.PHONY: docker-run
docker-run: ## Run Docker container
	@echo "$(GREEN)Running Docker container...$(RESET)"
	docker run -p $(PORT):3000 wach-blog

.PHONY: docker-compose-up
docker-compose-up: ## Start Docker Compose services
	@echo "$(GREEN)Starting Docker Compose services...$(RESET)"
	docker-compose up -d

.PHONY: docker-compose-down
docker-compose-down: ## Stop Docker Compose services
	@echo "$(GREEN)Stopping Docker Compose services...$(RESET)"
	docker-compose down

# Cleaning
.PHONY: clean
clean: ## Clean build artifacts
	@echo "$(GREEN)Cleaning build artifacts...$(RESET)"
	rm -rf .next out dist coverage .nyc_output

.PHONY: clean-all
clean-all: ## Clean all generated files
	@echo "$(GREEN)Cleaning all generated files...$(RESET)"
	rm -rf .next out dist coverage .nyc_output node_modules yarn.lock

# Security
.PHONY: audit
audit: ## Run security audit
	@echo "$(GREEN)Running security audit...$(RESET)"
	yarn audit

.PHONY: audit-fix
audit-fix: ## Fix security vulnerabilities
	@echo "$(GREEN)Fixing security vulnerabilities...$(RESET)"
	yarn audit --fix

# Performance
.PHONY: lighthouse
lighthouse: ## Run Lighthouse performance audit
	@echo "$(GREEN)Running Lighthouse audit...$(RESET)"
	@if command -v lighthouse >/dev/null 2>&1; then \
		lighthouse http://localhost:$(PORT) --output html --output-path ./lighthouse-report.html; \
	else \
		echo "$(RED)Lighthouse CLI not found. Install with: npm install -g lighthouse$(RESET)"; \
	fi

# Development Workflow
.PHONY: setup
setup: ## Complete development setup
	@echo "$(GREEN)Setting up development environment...$(RESET)"
	$(MAKE) install
	$(MAKE) test-e2e-install
	@echo "$(GREEN)Setup complete! Run 'make dev' to start development.$(RESET)"

.PHONY: check
check: ## Run all checks (lint, test, build)
	@echo "$(GREEN)Running all checks...$(RESET)"
	$(MAKE) lint
	$(MAKE) type-check
	$(MAKE) test
	$(MAKE) build-dev
	@echo "$(GREEN)All checks passed!$(RESET)"

.PHONY: pre-commit
pre-commit: ## Run pre-commit checks
	@echo "$(GREEN)Running pre-commit checks...$(RESET)"
	$(MAKE) format
	$(MAKE) lint-fix
	$(MAKE) type-check
	$(MAKE) test
	@echo "$(GREEN)Pre-commit checks completed!$(RESET)"

# Production Workflow
.PHONY: deploy-prep
deploy-prep: ## Prepare for deployment
	@echo "$(GREEN)Preparing for deployment...$(RESET)"
	$(MAKE) clean
	$(MAKE) install
	$(MAKE) lint
	$(MAKE) type-check
	$(MAKE) test
	$(MAKE) build
	@echo "$(GREEN)Deployment preparation complete!$(RESET)"

.PHONY: deploy-static
deploy-static: ## Deploy static build
	@echo "$(GREEN)Deploying static build...$(RESET)"
	$(MAKE) build-static
	@echo "$(GREEN)Static build ready in 'out' directory!$(RESET)"

# Monitoring and Logs
.PHONY: logs
logs: ## Show application logs
	@echo "$(GREEN)Showing application logs...$(RESET)"
	@if [ -f "logs/app.log" ]; then \
		tail -f logs/app.log; \
	else \
		echo "$(YELLOW)No log file found.$(RESET)"; \
	fi

.PHONY: status
status: ## Show project status
	@echo "$(CYAN)Project Status:$(RESET)"
	@echo "Node.js version: $(shell node --version)"
	@echo "Yarn version: $(shell yarn --version)"
	@echo "Next.js version: $(shell node -p "require('./package.json').dependencies.next")"
	@echo "TypeScript version: $(shell node -p "require('./package.json').devDependencies.typescript")"
	@echo "Tailwind CSS version: $(shell node -p "require('./package.json').dependencies.tailwindcss")"

# Utility
.PHONY: update-deps
update-deps: ## Update dependencies
	@echo "$(GREEN)Updating dependencies...$(RESET)"
	yarn upgrade-interactive --latest

.PHONY: outdated
outdated: ## Check for outdated dependencies
	@echo "$(GREEN)Checking for outdated dependencies...$(RESET)"
	yarn outdated

.PHONY: size
size: ## Check project size
	@echo "$(GREEN)Checking project size...$(RESET)"
	@du -sh . --exclude=node_modules --exclude=.git --exclude=.next --exclude=out

# Windows-specific
.PHONY: windows-setup
windows-setup: ## Windows-specific setup
	@echo "$(GREEN)Setting up for Windows...$(RESET)"
	$(MAKE) install
	@echo "$(GREEN)Windows setup complete!$(RESET)"

.PHONY: windows-dev
windows-dev: ## Windows development server setup
	@echo "$(GREEN)Setting up Windows development environment...$(RESET)"
	@echo "$(GREEN)Starting development server...$(RESET)"
	yarn dev

# Documentation
.PHONY: docs
docs: ## Generate documentation
	@echo "$(GREEN)Generating documentation...$(RESET)"
	@if command -v jsdoc >/dev/null 2>&1; then \
		jsdoc -c jsdoc.json; \
	else \
		echo "$(YELLOW)JSDoc not found. Install with: npm install -g jsdoc$(RESET)"; \
	fi

# Backup and Restore
.PHONY: backup
backup: ## Create backup of content
	@echo "$(GREEN)Creating backup...$(RESET)"
	@tar -czf backup-$(shell date +%Y%m%d-%H%M%S).tar.gz \
		--exclude=node_modules \
		--exclude=.next \
		--exclude=out \
		--exclude=.git \
		data/ \
		public/ \
		components/ \
		layouts/ \
		app/

.PHONY: restore
restore: ## Restore from backup
	@echo "$(GREEN)Restoring from backup...$(RESET)"
	@read -p "Enter backup filename: " backup_file; \
	tar -xzf $$backup_file

# Show available targets
.PHONY: targets
targets: ## Show all available targets
	@echo "$(CYAN)Available targets:$(RESET)"
	@awk -F ':|##' '/^[^\t].+?:.*?##/ && $$1 ~ /^[a-zA-Z_-]+$$/ { printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2 }' $(MAKEFILE_LIST) 