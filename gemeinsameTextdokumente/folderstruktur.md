# Projektstruktur

```text
project-root/
├── app/
│   ├── page.tsx
│   │   # State-Logik zur Anzeige der richtigen Komponenten
│   │   # einzige Page der Web-App (Single Page Application)
│   │
│   ├── actions.tsx
│   │   # Server Actions (entsprechen etwa dem traditionellen Backend)
│   │   # API routes DB + AI
│   │   # Promtaufbereitung
│   │
│   ├── assessment/
│   │   ├── components/
│   │   │   # Komponenten der Hauptfunktion „Assessment“
│   │   └── utils/
│   │       # Client-seitige Hilfsfunktionen
│   │
│   ├── otherFeatures/
│   │   ├── components/
│   │   │   # Komponenten weiterer Funktionen
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
