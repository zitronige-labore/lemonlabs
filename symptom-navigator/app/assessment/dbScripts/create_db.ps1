Write-Host "=== lemonlabs_db Setup ===" -ForegroundColor Cyan

$PG_USER = Read-Host "PostgreSQL username"
$PG_PASS = Read-Host "PostgreSQL password" -AsSecureString
$PG_HOST = Read-Host "PostgreSQL host [leave blank for localhost]"
if (-not $PG_HOST) { $PG_HOST = "localhost" }
$PG_PORT = Read-Host "PostgreSQL port [leave blank for 5432]"
if (-not $PG_PORT) { $PG_PORT = "5432" }

$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($PG_PASS)
$env:PGPASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

foreach ($DB in @("lemonlabs_db", "testlemonlabs_db")) {
    Write-Host "`nCreating $DB if it does not exist..." -ForegroundColor Yellow
    psql -h $PG_HOST -p $PG_PORT -U $PG_USER -d postgres `
        -c "SELECT 'CREATE DATABASE $DB' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB')\gexec"

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create $DB. Exiting." -ForegroundColor Red
        $env:PGPASSWORD = ""
        exit 1
    }

    Write-Host "Running schema setup for $DB..." -ForegroundColor Yellow
    psql -h $PG_HOST -p $PG_PORT -U $PG_USER -d $DB -f "$scriptDir\create_db.sql"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Done! $DB is ready." -ForegroundColor Green
    } else {
        Write-Host "Schema setup failed for $DB." -ForegroundColor Red
        $env:PGPASSWORD = ""
        exit 1
    }
}

$env:PGPASSWORD = ""