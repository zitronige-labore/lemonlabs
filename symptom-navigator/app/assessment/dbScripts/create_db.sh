#!/bin/bash

echo "=== lemonlabs_db Setup ==="
read -p "PostgreSQL username: " PG_USER
read -s -p "PostgreSQL password: " PG_PASS
echo ""
read -p "PostgreSQL host [localhost]: " PG_HOST
PG_HOST=${PG_HOST:-localhost}
read -p "PostgreSQL port [5432]: " PG_PORT
PG_PORT=${PG_PORT:-5432}

export PGPASSWORD="$PG_PASS"

echo ""
echo "Creating database lemonlabs_db if it does not exist..."
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d postgres \
    -c "SELECT 'CREATE DATABASE lemonlabs_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'lemonlabs_db')\gexec"

if [ $? -ne 0 ]; then
    echo "Failed to create database. Exiting."
    unset PGPASSWORD
    exit 1
fi

echo "Running schema setup..."
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d lemonlabs_db -f create_db.sql

if [ $? -eq 0 ]; then
    echo "Done! Database lemonlabs_db is ready."
else
    echo "Schema setup failed."
    unset PGPASSWORD
    exit 1
fi

unset PGPASSWORD