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

for DB in lemonlabs_db testlemonlabs_db; do
    echo ""
    echo "Creating $DB if it does not exist..."

    EXISTS=$(psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB'")

    if [ "$EXISTS" != "1" ]; then
        psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d postgres -c "CREATE DATABASE $DB"
    else
        echo "$DB already exists, skipping creation."
    fi

    if [ $? -ne 0 ]; then
        echo "Failed to create $DB. Exiting."
        unset PGPASSWORD
        exit 1
    fi

    echo "Running schema setup for $DB..."
    psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$DB" -f create_db.sql

    if [ $? -eq 0 ]; then
        echo "Done! $DB is ready."
    else
        echo "Schema setup failed for $DB."
        unset PGPASSWORD
        exit 1
    fi
done

unset PGPASSWORD