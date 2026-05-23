.PHONY: help dev build test clean docker-up docker-down

help:
	@echo "Available commands:"
	@echo "  make dev           - Start development servers"
	@echo "  make build         - Build production bundles"
	@echo "  make test          - Run tests"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make docker-up     - Start Docker containers"
	@echo "  make docker-down   - Stop Docker containers"

dev:
	@echo "Starting development servers..."
	docker-compose up

build:
	@echo "Building production bundles..."
	cd frontend && npm run build
	cd backend && pip install -r requirements.txt

test:
	@echo "Running tests..."
	cd frontend && npm run test
	cd backend && pytest

clean:
	@echo "Cleaning build artifacts..."
	cd frontend && rm -rf .next build node_modules
	cd backend && rm -rf __pycache__ .pytest_cache dist

docker-up:
	docker-compose up --build

docker-down:
	docker-compose down

docker-logs-backend:
	docker-compose logs -f backend

docker-logs-frontend:
	docker-compose logs -f frontend

docker-logs-celery:
	docker-compose logs -f celery_worker
