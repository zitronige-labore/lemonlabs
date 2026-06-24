# lemonlabs
MEP Projekt

# Änderungsvorschläge
Bitte keine gemeinsamen Textdateien ändern, ohne Absprache mit dem Team.  
Am bestenn vor Ort, wenn nicht Anwesend Vorschläge bitte auf Discord in "änderungsvorschläge".

# Nur Issue Kategorien anzeigen
is:issue state:open has:sub-issue in die leiste oben bei den Issues eingeben.

# Unser Link zum Ausprobieren  
(nur UI, DB und AI Verbindung funktionieren hier nicht)  
[https://lemonlabs-plum.vercel.app/](https://lemonlabs-git-develop-lemoblabs-ba86c8a6.vercel.app)

# Anweisungen lokal hosten
Vorraussetzungen: node.js, postgres mit lemonlabd_db und testlemonlabs_db (beide identisch siehe db setup in skripte)  
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
MEDGEMMA_API_KEY=sk-s87RnNMaz4LhtjNMsl5HHg  
MEDGEMMA_API_MODEL=medgemma:27b  

\# Fhir Server connection  
FHIR_SERVER_URL=https://hapi.fhir.org/baseR4  

## für developer run
Root folder -> Terminal öffnen -> npm install -> npm dev run  

## für build start
Root folder -> Terminal öffnen -> npm install -> npm run build -> npm start
