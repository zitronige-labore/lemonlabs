# Projektstruktur

```text
project-root/
├── app/
│   ├── page.tsx
│   │   # State-Logik zur Anzeige der richtigen Komponenten
│   │   # Einzige Page der Web-App (Single Page Application)
│   │
│   ├── actions.tsx
│   │   # Server Actions (entsprechen dem traditionellen Backend)
│   │   # API-Routen für Datenbank- und KI-Zugriffe
│   │   # Prompt-Aufbereitung
│   │
│   ├── assessment/
│   │   ├── components/
│   │   │   # Komponenten der Hauptfunktion „Assessment“
│   │   ├── utils/
│   │   │   # Client-seitige Hilfsfunktionen
│   │   └── medicalLogic/
│   │       # Symptom- und Red-Flag-Logik
│   │
│   ├── otherFeatures/
│   │   ├── components/
│   │   │   # Komponenten weiterer Funktionen
│   │   └── utils/
│   │       # Client-seitige Hilfsfunktionen
│   │
│   ├── dbs/
│   │   # Datenbank-Verbindungsspezifikationen
│   │   # z. B. lemonlabs_db
│   │
│   ├── types/
│   │   # Zentrale Definition aller verwendeten TypeScript-Typen
│   │
│   └── ping/
│       # Endpoint zum Prüfen der Serververbindung
│
├── public/
│   # Statische Assets
│   # - Bilder
│   # - manifest.json
│
├── __tests__/
│   # Unit- und Integrationstests
│
├── e2e/
│   # End-to-End-Tests
│
├── README.md
│   # Projektdokumentation
│
└── configfiles/
    # Konfigurationsdateien
    # z. B. tsconfig.json
```
