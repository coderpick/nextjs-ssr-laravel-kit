#!/bin/sh

# Check if node_modules directory exists
if [ ! -d "node_modules" ]; then

    npm install
fi

# Copy .env file if it doesn't exist
if [ ! -f .env.local ]; then
    cp .env.docker.dev .env.local
fi



# Start the Next.js development server
npm run dev