# Projektstruktur

```text
project-root/
├── app/
│   ├── page.tsx
│   │   # Enthält die State-Logik zur Anzeige der richtigen Komponenten.
│   │   # Dies ist die einzige Page der Web-App (Single Page Application).
│   │
│   ├── actions.tsx
│   │   # Enthält Server Actions.
│   │   # Entspricht am ehesten dem traditionellen Backend.
│   │
│   ├── assessment/
│   │   ├── components/
│   │   │   # Komponenten der Hauptfunktion „Assessment“
│   │   └── utils/
│   │       # Client-seitige Hilfsfunktionen
│   │
│   ├── otherFeatures/
│   │   ├── components/
│   │   │   # Komponenten weiterer Hauptfunktionen
│   │   └── utils/
│   │       # Client-seitige Hilfsfunktionen
│   │
│   ├── dbs/
│   │   # Verbindungsspezifikationen zu:
│   │   # - lemonlabs_db
│   │   # - AI-Kontext-Datenbank
│   │
│   └── types/
│       # Zentrale Definition aller verwendeten TypeScript-Typen
│
├── public/
│   # Statische Assets:
│   # - Bilder
│   # - manifest.json
│
├── README.md
│   # Projektdokumentation
│
├── configfiles
    # z.b. tsconfig.json
