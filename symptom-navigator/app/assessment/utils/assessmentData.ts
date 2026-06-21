/*
  Import der benötigten Typen aus der zentralen Typdefinition.

  MainRegion:
  Hauptbereiche der Körperkarte

  SubRegion:
  Genauere Unterbereiche der Körperkarte

  RedFlags:
  Medizinische Warnzeichen
*/
import type {
  MainRegion,
  RedFlags,
  SubRegion,
} from "../../types/assessment";

/*
  Anfangszustand aller Warnzeichen.

  Zu Beginn sind alle Werte auf false gesetzt,
  da zunächst kein Warnzeichen ausgewählt ist.
*/
export const emptyRedFlags: RedFlags = {
  chestPain: false,
  breathingProblems: false,
  unconsciousness: false,
  severeBleeding: false,
  strokeSymptoms: false,
  highFeverConfusion: false,
};

/*
  Liefert passende Unterregionen
  zur ausgewählten Hauptregion zurück.

  Beispiel:
  "Kopf & Gesicht" → ["Kopf", "Augen", ...]
*/
export function getSubRegions(
  region: MainRegion | null
): SubRegion[] {
  switch (region) {
    case "Kopf & Gesicht":
      return ["Kopf", "Augen", "Ohren", "Nase", "Mund / Zähne"];

    case "Hals":
      return ["Hals"];

    case "Nacken":
      return ["Nacken"];

    case "Brust":
      return ["Brust links", "Brust rechts"];

    case "Bauch":
      return ["OberbauchRechts", "UnterbauchRechts", "OberbauchLinks", "UnterbauchLinks"];

    case "Rücken":
      return ["Rücken oben", "Rücken unten"];

    case "Becken & Unterleib":
      return ["Becken", "Genitalbereich"];

    case "Arme & Hände links":
      return ["SchulterLinks", "OberarmLinks", "UnterarmLinks",
        "HandLinks"];

    case "Arme & Hände rechts":
      return ["SchulterRechts", "OberarmRechts", "UnterarmRechts",
        "HandRechts"];

    case "Beine & Füße links":
      return ["OberschenkelLinks", "KnieLinks", "UnterschenkelLinks", 
        "FußLinks"];

    case "Beine & Füße rechts":
      return ["OberschenkelRechts", "KnieRechts", "UnterschenkelRechts", 
        "FußRechts"];

    case "Psyche":
      return [];

    case "Allgemein (ganzer Körper)":
      return [];

    /*
      Falls keine passende Region gefunden wird,
      wird ein leeres Array zurückgegeben.
    */
    default:
      return [];
  }
}


/**
 * Converts coded DB values into human-readable strings for display.
 * @param data - object in the format of getUserDataFromDB() (non-null)
 * @returns [
 *   geschlecht: 'männlich' | 'weiblich' | 'divers' | undefined,
 *   schwangerschaft: 'ja' | 'nein' | 'nicht angegeben',
 *   stillzeit: 'ja' | 'nein' | 'nicht angegeben',
 *   worsening: 'ja' | 'nein' | undefined
 * ]
 */
export function makeDBDataReadable(data: any)
{
   // convert coded values to be read by users where necessary

    let geschlecht = data?.caseData?.[0]?.sex;
    if (geschlecht === "m") {
        geschlecht = "männlich";
    } else if (geschlecht === "w") {
        geschlecht = "weiblich";
    }

    let schwangerschaft = "nicht angegeben";
    if (data?.caseData?.[0]?.pregnancy === true) schwangerschaft = "ja";
    else if (data?.caseData?.[0]?.pregnancy === false) schwangerschaft = "nein";

    let stillzeit = "nicht angegeben";
    if (data?.caseData?.[0]?.lactation === true) stillzeit = "ja";
    else if (data?.caseData?.[0]?.lactation === false) stillzeit = "nein";

    let worsening = "nicht angegeben";
    if (data?.additionalInfoData?.[0]?.worsening === true) worsening = "ja";
    else if (data?.additionalInfoData?.[0]?.worsening === false) worsening = "nein";

    let medication = ["nicht angegeben"];
    const medList = data?.medicationData?.map((m: {
        medication: string;
        dose: number;
        unit: string;
        taken_since: Date;
        frequency: number;
        frequency_unit: string;
    }) => `Name: ${m.medication}, Dosis: ${m.dose}${m.unit}, ${m.frequency} mal pro ${m.frequency_unit}`);

    if (medList && medList.length > 0) {
        medication = medList;
    }

    return [geschlecht, schwangerschaft, stillzeit, worsening, medication]
}
