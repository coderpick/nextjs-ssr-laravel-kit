#!/bin/bash

# Install composer dependencies
echo "Installing composer dependencies..."
composer install --no-interaction --optimize-autoloader

echo "Copying .env file..."
# Copy .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
fi

echo "Generating application key..."
# Generate application key if not already set
php artisan key:generate --no-interaction --force

echo "Running migrations and seeding..."
# Run migrations and seed
php artisan migrate --seed --no-interaction --force

echo "Starting Apache..."
# Start Apache
apache2-foreground
