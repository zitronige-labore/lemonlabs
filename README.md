# lemonlabs
MEP Projekt

# Änderungsvorschläge
Bitte keine gemeinsamen Textdateien ändern, ohne Absprache mit dem Team.  
Am bestenn vor Ort, wenn nicht Anwesend Vorschläge bitte auf Discord in "änderungsvorschläge".

# Hinweis zum Code
Wir arbeiten zum coden auf dem branch develop

# Unser Link zum Ausprobieren  
(nur UI, DB und AI Verbindung funktionieren hier nicht)  
[https://lemonlabs-plum.vercel.app/](https://lemonlabs-git-develop-lemoblabs-ba86c8a6.vercel.app)

# Anweisungen hosten
ohne Docker:
Vorraussetzungen: kein ARM Prozessor, node.js, postgres installiert mit lemonlabd_db und testlemonlabs_db (setup siehe unten)  
.env muss mit korrektem Passwort und Username eingefügt werden, bsp.:  
  
\# Connection URL 
POSTGRES_URL="postgres://postgres:123@127.0.0.1:5432/lemonlabs_db"  
POSTGRES_URL_NON_POOLING="postgres://postgres:123@127.0.0.1:5432/lemonlabs_db"  
POSTGRES_USER="postgres"  
POSTGRES_HOST="127.0.0.1"  
POSTGRES_PASSWORD="123"  
POSTGRES_DATABASE="lemonlabs_db"  

\# MedGemma API  
MEDGEMMA_API_URL=http://141.19.140.104:4000/v1/chat/completions  
MEDGEMMA_API_KEY=api key hier  
MEDGEMMA_API_MODEL=medgemma:27b   

mit Docker:
Vorraussetzungen:  
Docker installiert, bei Windows WSL 

\# Fhir Server connection  
FHIR_SERVER_URL=https://hapi.fhir.org/baseR4  

## für developer run
Root folder -> Terminal öffnen -> npm install -> npm run dev  

## für developer test run (e2e)
Root folder -> Terminal öffnen -> npm install -> npm run dev:test -> neues Terminal öffnen ->  npm run test:e2e:ui  


## für build start
Root folder -> Terminal öffnen -> npm install -> npm run build -> npm start

## für docker
Root folder -> Terminal öffnen ->  
für build (erstes mal oder bei Änderungen)  
-> docker compose up --build  
normal:  
-> docker compose up  
(auf Linux docker-compose)

## Skript für DB setup
auf Windows -> Root folder -> .\dbScripts\create_db.ps1  -> Passwort + Username eingeben (die anderen 2 Abfragen einfach mit Enter skippen)  
auf Unix -> Root folder/dbScripts -> chmod +x create_db.sh -> ./create_db.sh -> Passwort + Username eingeben (die anderen 2 Abfragen einfach mit Enter skippen)  
