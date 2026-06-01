/*
  Beschreibt alle möglichen Schritte des gesamten Ablaufs
  der Ersteinschätzung innerhalb der Anwendung.
*/

export type subregionCategory =
  | SubRegion
  | null;

export type categoryAfterCategoryIfNeeded =
  | "bsp";

export type symptomChoiceStep =
  | "innenOhr"
  | "aussenOhr"
  | "nase"
  | "augen"
  | "Kopf"
  | "kopfSpannung"
  | "kopfMigraene"
  | "kopfCluster"
  | "kopfBegleitung"
  | "kopfWarnsignale"
  | "MagenDarm"
  | "mdSpeiseroehre"
  | "mdMagen"
  | "mdDarm"
  | "mdGalle"
  | "mdEnddarm"
  | "ArmeHaende"
  | "armSchulter"
  | "armEllbogen"
  | "armHandFinger"
  | "armGefaesse"
  | "Hals"
  | "halsMandeln"
  | "halsRachen"
  | "halsKehlkopf"
  | "halsDruesen"
  | "RueckenOben"
  | "RueckenUnten"
  | "Becken"
  | "Genitalbereich"
  | "Oberschenkel"
  | "Knie"
  | "Unterschenkel"
  | "Fuß"
  | "AllgemeinesBefinden"
  | "genitalHarnwege"
  | "genitalSymptomeWeiblich"
  | "genitalSymptomeMaennlich"
  | "genitalSymptomeDivers"
  | "genitalWarnsignale"
  | "beineGelenke"     
  | "beineMuskeln"      
  | "beineNervenGefaese" 
  | "beineWarnsignale"
  | "nackenBewegung"     
  | "nackenWarnsignale"    
  | "mundZaehneSchmerz"    
  | "mundZaehneSchleimhaut"
  | "Mund"
  | "Zaehne"
  | "MundZaehne"; 



export type Step =
  | "start"
  | "hinweise"
  | "redflags"
  | "basisStart"
  | "bodyRegion"
  | "symptomChoice"
  | "symptomInput"
  | "basisDetails"
  | "additionalInfo"
  | "result"
  | "textInput"
  | "selectMoreSymptoms"
  | "manageData"
  | subregionCategory
  | categoryAfterCategoryIfNeeded
  | symptomChoiceStep;

/*
  Zusatzangaben der Nutzerin oder des Nutzers.
*/
export type AdditionalData = {
  medication?: string;

  conditions: string;

  allergies: string;

  temperature: string;
  duration: string;
  worsening: string;

  weight: string;
  height: string;

  breastfeeding: string;

  extraInfo: string;
};

/*
  Hauptregionen der interaktiven Körperkarte.

  Diese Bereiche werden zuerst ausgewählt,
  bevor eine genauere Unterregion bestimmt wird.
*/
export type MainRegion =
  | "Kopf & Gesicht"
  | "Hals & Nacken"
  | "Brust"
  | "Bauch"
  | "Rücken"
  | "Becken & Unterleib"
  | "Arme & Hände"
  | "Beine & Füße"
  | "Psyche"
  | "Allgemein (ganzer Körper)";

/*
  Genauere Unterregionen innerhalb einer Hauptregion.

  Diese Auswahl dient dazu, Beschwerden
  präziser zuzuordnen.
*/
export type SubRegion =
  | "Kopf"
  | "Augen"
  | "Ohren"
  | "Nase"
  | "Mund / Zähne"
  | "Hals"
  | "Nacken"
  | "Brust links"
  | "Brust rechts"
  | "Oberbauch"
  | "Unterbauch"
  | "Rücken oben"
  | "Rücken unten"
  | "Becken"
  | "Genitalbereich"
  | "Schulter"
  | "Oberarm"
  | "Unterarm"
  | "Hand"
  | "Oberschenkel"
  | "Knie"
  | "Unterschenkel"
  | "Fuß"
  | "Psyche"
  | "Keine bestimmte Region / mehrere Stellen";


/*
  Enthält alle möglichen Warnzeichen,
  die auf einen medizinischen Notfall
  hinweisen können.
*/
export type RedFlags = {
  chestPain: boolean;
  breathingProblems: boolean;
  unconsciousness: boolean;
  severeBleeding: boolean;
  strokeSymptoms: boolean;
  highFeverConfusion: boolean;
};

/*
  Speichert allgemeine Angaben der Nutzerin
  oder des Nutzers sowie zusätzliche Informationen
  zu den Beschwerden.
*/
export type BasisData = {
  age: string;
  gender: string;
  pregnancy: string;
  duration: string;
  intensity: string;
};
