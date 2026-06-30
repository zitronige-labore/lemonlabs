// this file contains the symptom category list
// this list can be adjusted to change the categories leading to the specific symptoms


import { Step, SymptomCategoryList } from "@/app/types/assessment";

export function getSymptomCategoryList(gender: string) {

  // list for category pages
  /* pattern: 
  {step: this is a subregion step, so either:
    "Kopf", "Augen", "Ohren", "Nase", "Mund / Zähne", "Hals", "Nacken", "Brust links", "Brust rechts",
    "Oberbauch", "Unterbauch", "Rücken oben", "Rücken unten", "Becken", "Genitalbereich","Schulter",
    "Oberarm", "Unterarm", "Hand", "Oberschenkel", "Knie", "Unterschenkel", "Fuß", "Psyche", "Keine bestimmte Region / mehrere Stellen";
    since there are already symptoms for all subregions, please just adjust the categories as needed
    ,
    categories:[
        { category: "this is the text that will show up on the category button", step: "this is the name for the next category step, 
        this *exact* name must show up as a step entry in SymptomList.ts in the same folder as this file" },
        { category: "more categories can be added here", step: "aussenOhr" }
      ]
    },*/
  const categoryList: SymptomCategoryList =
    [
      {
        step: "Psyche",
        categories:
          [
            { category: "Energie & Antrieb", step: "psycheEnergie" },
            { category: "Stimmung", step: "psycheStimmung" },
            { category: "Angst & Körper", step: "psycheAngst" },
            { category: "Wahrnehmung", step: "psycheWahrnehmung" },
            { category: "Akute Krise", step: "psycheKrise" }
          ]
      },
      {
        step: "Ohren",
        categories: [
          { category: "innenohr", step: "innenOhr" },
          { category: "aussenohr", step: "aussenOhr" }
        ]
      },
      {
        step: "Kopf",
        categories: [
          { category: "Spannung & Druck im Kopf", step: "kopfSpannung" },
          { category: "Migräne & Pulsieren", step: "kopfMigraene" },
          { category: "Cluster-Schmerz & Bohren", step: "kopfCluster" },
          { category: "Zusätzliche Begleitbeschwerden", step: "kopfBegleitung" },
          { category: "Allgemein starke Schmerzen", step: "kopfWarnsignale" }
        ]
      },
      {
        step: "Nacken",
        categories:
          [
            { category: "Verspannung & Bewegungsschmerz", step: "nackenBewegung" },
            { category: "Starke Nackenbeschwerden", step: "nackenWarnsignale" }
          ]
      },
      {
        step: "Mund / Zähne",
        categories:
          [
            { category: "Zahnschmerzen & Kieferbeschwerden", step: "mundZaehneSchmerz" },
            { category: "Zahnfleisch & Mundschleimhaut", step: "mundZaehneSchleimhaut" }
          ]
      },
      {
        step: "Oberbauch",
        categories:
          [
            { category: "Speiseröhre (Schluckbeschwerden)", step: "mdSpeiseroehre" },
            { category: "Magen (Oberbauch)", step: "mdMagen" },
            { category: "Leber & Galle", step: "mdGalle" }
          ]
      },
      {
        step: "Unterbauch",
        categories:
          [
            { category: "Darm & Verdauung", step: "mdDarm" },
            { category: "Leber & Galle", step: "mdGalle" },
            { category: "Enddarm & Stuhlgang", step: "mdEnddarm" }
          ]
      },
      {
        step: "ArmeHaende",
        categories:
          [
            { category: "Schulter & Oberarm", step: "armSchulter" },
            { category: "Ellbogen & Unterarm", step: "armEllbogen" },
            { category: "Handgelenk & Finger", step: "armHandFinger" },
            { category: "Neurologie, Gefäße & Warnsignale", step: "armGefaesse" }
          ]
      },
      {
        step: "Hals",
        categories:
          [
            { category: "Mandeln & Mundhöhle", step: "halsMandeln" },
            { category: "Rachenwand & Schlucken", step: "halsRachen" },
            { category: "Kehlkopf & Luftröhre", step: "halsKehlkopf" },
            { category: "Lymphknoten & Drüsen", step: "halsDruesen" }
          ]
      },
      {
        step: "Genitalbereich",
        categories:
          [
            { category: "Harnwege & Wasserlassen", step: "genitalHarnwege" },
            // Nutzt die lokale Variable direkt für den Verzweigungsschritt:
            {
              category: "Symptome im Genitalbereich",
              step: gender === "weiblich"
                ? "genitalSymptomeWeiblich"
                : gender === "männlich"
                  ? "genitalSymptomeMaennlich"
                  : "genitalSymptomeDivers"
            },
            { category: "Dringende Warnsignale (Genital)", step: "genitalWarnsignale" }
          ]
      },
      {
        step: "Becken",
        categories:
          [
            { category: "Harnwege & Wasserlassen", step: "genitalHarnwege" },
            // Nutzt die lokale Variable direkt für den Verzweigungsschritt:
            {
              category: "Symptome im Genitalbereich",
              step: gender === "weiblich"
                ? "genitalSymptomeWeiblich"
                : gender === "männlich"
                  ? "genitalSymptomeMaennlich"
                  : "genitalSymptomeDivers"
            },
            { category: "Dringende Warnsignale (Genital)", step: "genitalWarnsignale" }
          ]
      },
      {
        step: "Oberschenkel",
        categories:
          [
            { category: "Gelenkschmerzen & Steifheit", step: "beineGelenke" },
            { category: "Muskelbeschwerden & Krämpfe", step: "beineMuskeln" },
            { category: "Nerven, Gefäße & Durchblutung", step: "beineNervenGefaese" },
            { category: "Stärkere Beschwerden", step: "beineWarnsignale" }
          ]
      },
      {
        step: "Knie",
        categories:
          [
            { category: "Gelenkschmerzen & Steifheit", step: "beineGelenke" },
            { category: "Muskelbeschwerden & Krämpfe", step: "beineMuskeln" },
            { category: "Nerven, Gefäße & Durchblutung", step: "beineNervenGefaese" },
            { category: "Stärkere Beschwerden", step: "beineWarnsignale" }
          ]
      },
      {
        step: "Unterschenkel",
        categories:
          [
            { category: "Gelenkschmerzen & Steifheit", step: "beineGelenke" },
            { category: "Muskelbeschwerden & Krämpfe", step: "beineMuskeln" },
            { category: "Nerven, Gefäße & Durchblutung", step: "beineNervenGefaese" },
            { category: "Stärkere Beschwerden", step: "beineWarnsignale" }
          ]
      },
      {
        step: "Fuß",
        categories:
          [
            { category: "Gelenkschmerzen & Steifheit", step: "beineGelenke" },
            { category: "Muskelbeschwerden & Krämpfe", step: "beineMuskeln" },
            { category: "Nerven, Gefäße & Durchblutung", step: "beineNervenGefaese" },
            { category: "Stärkere Beschwerden", step: "beineWarnsignale" }
          ]
      }
    ]

  return categoryList;
}
