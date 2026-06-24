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
      return ["Oberbauch rechts", "Unterbauch rechts", "Oberbauch links", "Unterbauch links"];

    case "Rücken":
      return ["Rücken oben", "Rücken unten"];

    case "Becken & Unterleib":
      return ["Becken", "Genitalbereich"];

    case "Arme & Hände links":
      return ["Schulter links", "Oberarm links", "Unterarm links",
        "Hand links"];

    case "Arme & Hände rechts":
      return ["Schulter rechts", "Oberarm rechts", "Unterarm rechts",
        "Hand rechts"];

    case "Beine & Füße links":
      return ["Oberschenkel links", "Knie links", "Unterschenkel links", 
        "Fuß links"];

    case "Beine & Füße rechts":
      return ["Oberschenkel rechts", "Knie rechts", "Unterschenkel rechts", 
        "Fuß rechts"];

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


export function getMainRegionForSubRegion(sub: SubRegion): MainRegion[] {
  switch (sub) {
    case "Kopf":
    case "Augen":
    case "Ohren":
    case "Nase":
    case "Mund / Zähne":
      return ["Kopf & Gesicht"];
    case "Hals":
      return ["Hals"];
    case "Nacken":
      return ["Nacken"];
    case "Brust links":
      return ["Brust"];
    case "Brust rechts":
      return ["Brust"];
    case "Oberbauch links":
    case "Unterbauch links":
    case "Oberbauch rechts":
    case "Unterbauch rechts":
      return ["Bauch"];
    case "Rücken oben":
    case "Rücken unten":
      return ["Rücken"];
    case "Becken":
    case "Genitalbereich":
      return ["Becken & Unterleib"];
    case "Schulter links":
    case "Oberarm links":
    case "Unterarm links":
    case "Hand links":
      return ["Arme & Hände links"];
    case "Schulter rechts":
    case "Oberarm rechts":
    case "Unterarm rechts":
    case "Hand rechts":
      return ["Arme & Hände rechts"];
    case "Oberschenkel links":
    case "Knie links":
    case "Unterschenkel links":
    case "Fuß links":
      return ["Beine & Füße links"];
    case "Oberschenkel rechts":
    case "Knie rechts":
    case "Unterschenkel rechts":
    case "Fuß rechts":
      return ["Beine & Füße rechts"];
    default:
      return [];
  }
}


export function getWholeFromSides(sub: SubRegion): SubRegion {
  switch (sub) {
    case "Oberbauch rechts":
    case "Oberbauch links":
        return "Oberbauch";
    case "Unterbauch links":
    case "Unterbauch rechts":
      return "Unterbauch";
    case "Schulter links":
    case "Schulter rechts":
      return "Schulter";
    case "Oberarm links":
    case "Oberarm rechts":
      return "Oberarm";
    case "Unterarm links":
    case "Unterarm rechts":
      return "Unterarm";
    case "Hand links":
    case "Hand rechts":
      return "Hand";
    case "Oberschenkel links":
    case "Oberschenkel rechts":
      return "Oberschenkel";
    case "Knie links":
    case "Knie rechts":
      return "Knie";
    case "Unterschenkel links":
    case "Unterschenkel rechts":
      return "Unterschenkel";
    case "Fuß links":
    case "Fuß rechts":
      return "Fuß";
    default:
      return sub;
    
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
