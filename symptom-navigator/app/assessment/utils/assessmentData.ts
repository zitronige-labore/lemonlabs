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

    case "Hals & Nacken":
      return ["Hals", "Nacken"];

    case "Brust":
      return ["Brust links", "Brust rechts"];

    case "Bauch":
      return ["Oberbauch", "Unterbauch"];

    case "Rücken":
      return ["Rücken oben", "Rücken unten"];

    case "Becken & Unterleib":
      return ["Becken", "Genitalbereich"];

    case "Arme & Hände":
      return ["Schulter", "Oberarm", "Unterarm", "Hand"];

    case "Beine & Füße":
      return ["Oberschenkel", "Knie", "Unterschenkel", "Fuß"];

    case "Psyche":
      return ["Haut allgemein"];

    case "Allgemein (ganzer Körper)":
      return ["Keine bestimmte Region / mehrere Stellen"];

    /*
      Falls keine passende Region gefunden wird,
      wird ein leeres Array zurückgegeben.
    */
    default:
      return [];
  }
}

/*
  Liefert typische Symptome
  passend zur ausgewählten Unterregion zurück.

  Diese Symptome werden später
  in der Symptomauswahl angezeigt.
*/
export function getSymptomsForSubRegion(
  region: SubRegion | null
): string[] {
  switch (region) {
    case "Kopf":
      return [
        "Kopfschmerzen",
        "Schwindel",
        "Übelkeit",
        "Druckgefühl",
      ];

    case "Augen":
      return [
        "Augenschmerzen",
        "Rötung",
        "Sehstörung",
        "Lichtempfindlichkeit",
      ];

    case "Ohren":
      return [
        "Ohrenschmerzen",
        "Hörminderung",
        "Ohrgeräusche",
        "Druckgefühl",
      ];

    case "Nase":
      return [
        "Schnupfen",
        "Verstopfte Nase",
        "Nasenschmerzen",
        "Nasenbluten",
      ];

    case "Mund / Zähne":
      return [
        "Zahnschmerzen",
        "Schmerzen im Mund",
        "Schwellung",
        "Bluten",
      ];

    case "Hals":
      return [
        "Halsschmerzen",
        "Schluckbeschwerden",
        "Heiserkeit",
        "Schwellung",
      ];

    case "Nacken":
      return [
        "Nackenschmerzen",
        "Steifigkeit",
        "Verspannung",
        "Bewegungseinschränkung",
      ];

    /*
      Für beide Brustseiten werden dieselben Symptome verwendet.
    */
    case "Brust links":
    case "Brust rechts":
      return [
        "Brustschmerzen",
        "Engegefühl",
        "Druckgefühl",
        "Schmerzen beim Atmen",
      ];

    case "Oberbauch":
      return [
        "Oberbauchschmerzen",
        "Übelkeit",
        "Erbrechen",
        "Sodbrennen",
      ];

    case "Unterbauch":
      return [
        "Unterbauchschmerzen",
        "Durchfall",
        "Verstopfung",
        "Blähungen",
      ];

    /*
      Für oberen und unteren Rücken
      werden gemeinsame Symptome verwendet.
    */
    case "Rücken oben":
    case "Rücken unten":
      return [
        "Rückenschmerzen",
        "Verspannung",
        "Ausstrahlung ins Bein",
      ];

    case "Becken":
      return [
        "Beckenschmerzen",
        "Druckgefühl",
        "Schmerzen beim Sitzen",
      ];

    case "Genitalbereich":
      return [
        "Schmerzen",
        "Juckreiz oder Brennen",
        "Schwellung",
        "Ausfluss",
      ];

    /*
      Für Arme und Hände
      werden gemeinsame Symptome verwendet.
    */
    case "Schulter":
    case "Oberarm":
    case "Unterarm":
    case "Hand":
      return [
        "Schmerzen",
        "Taubheitsgefühl",
        "Schwellung",
        "Bewegungseinschränkung",
      ];

    /*
      Für Beine und Füße
      werden gemeinsame Symptome verwendet.
    */
    case "Oberschenkel":
    case "Knie":
    case "Unterschenkel":
    case "Fuß":
      return [
        "Schmerzen",
        "Schwellung",
        "Taubheitsgefühl",
        "Probleme beim Gehen",
      ];

    case "Haut allgemein":
      return [
        "Ausschlag",
        "Juckreiz",
        "Rötung",
        "Schwellung",
      ];

    case "Keine bestimmte Region / mehrere Stellen":
      return [
        "Fieber",
        "Müdigkeit",
        "Schwindel",
        "Allgemeines Krankheitsgefühl",
      ];

    /*
      Falls keine passende Unterregion gefunden wird,
      wird ein leeres Array zurückgegeben.
    */
    default:
      return [];
  }
}
