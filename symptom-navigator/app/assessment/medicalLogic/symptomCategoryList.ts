import { Step } from "@/app/types/assessment";

export function getSymptomCategoryList(gender: string) {

  // list for category pages
  const categoryList: {
  step: Step;
  categories: {
    category: string;
    step: Step;
    }[];
  }[] = 
    [
    {step: "Ohren",
    categories:[
        { category: "innenohr", step: "innenOhr" },
        { category: "aussenohr", step: "aussenOhr" }
      ]
    },
    {step: "Kopf",
      categories: [
        { category: "Spannung & Druck im Kopf", step: "kopfSpannung" },
        { category: "Migräne & Pulsieren", step: "kopfMigraene" },
        { category: "Cluster-Schmerz & Bohren", step: "kopfCluster" },
        { category: "Begleiterscheinungen (Kopf)", step: "kopfBegleitung" },
        { category: "Dringende Warnsignale (Kopf)", step: "kopfWarnsignale" }
      ]
    },
    {step: "Nacken",
      categories:
      [
        { category: "Verspannung & Bewegungsschmerz", step: "nackenBewegung" },
        { category: "Dringende Warnsignale (Nacken)", step: "nackenWarnsignale" }
      ]
    },
    {step: "Mund / Zähne",
      categories:
      [
        { category: "Zahnschmerzen & Kieferbeschwerden", step: "mundZaehneSchmerz" },
        { category: "Zahnfleisch & Mundschleimhaut", step: "mundZaehneSchleimhaut" }
      ]
    },
    {step: "Oberbauch",
      categories:
      [
        { category: "Speiseröhre (Schluckbeschwerden)", step: "mdSpeiseroehre" },
        { category: "Magen (Oberbauch)", step: "mdMagen" },
        { category: "Leber & Galle", step: "mdGalle" }
      ]
    },
    {step: "Unterbauch",
      categories:
      [
        { category: "Darm & Verdauung", step: "mdDarm" },
        { category: "Leber & Galle", step: "mdGalle" },
        { category: "Enddarm & Stuhlgang", step: "mdEnddarm" }
      ]
    },
    {step: "ArmeHaende",
      categories:
      [
        { category: "Schulter & Oberarm", step: "armSchulter" },
        { category: "Ellbogen & Unterarm", step: "armEllbogen" },
        { category: "Handgelenk & Finger", step: "armHandFinger" },
        { category: "Neurologie, Gefäße & Warnsignale", step: "armGefaesse" }
      ]
    },
    {step: "Hals",
      categories:
      [
        { category: "Mandeln & Mundhöhle", step: "halsMandeln" },
        { category: "Rachenwand & Schlucken", step: "halsRachen" },
        { category: "Kehlkopf & Luftröhre", step: "halsKehlkopf" },
        { category: "Lymphknoten & Drüsen", step: "halsDruesen" }
      ]
    },
    {step: "Genitalbereich",
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
    {step: "Becken",
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
    {step: "Oberschenkel",
      categories:
      [
        { category: "Gelenkschmerzen & Steifheit", step: "beineGelenke" },
        { category: "Muskelbeschwerden & Krämpfe", step: "beineMuskeln" },
        { category: "Nerven, Gefäße & Durchblutung", step: "beineNervenGefaese" },
        { category: "Dringende Warnsignale (Beine)", step: "beineWarnsignale" }             
      ]
    },
    {step: "Knie",
      categories:
      [
        { category: "Gelenkschmerzen & Steifheit", step: "beineGelenke" },
        { category: "Muskelbeschwerden & Krämpfe", step: "beineMuskeln" },
        { category: "Nerven, Gefäße & Durchblutung", step: "beineNervenGefaese" },
        { category: "Dringende Warnsignale (Beine)", step: "beineWarnsignale" }             
      ]
    },
    {step: "Unterschenkel",
      categories:
      [
        { category: "Gelenkschmerzen & Steifheit", step: "beineGelenke" },
        { category: "Muskelbeschwerden & Krämpfe", step: "beineMuskeln" },
        { category: "Nerven, Gefäße & Durchblutung", step: "beineNervenGefaese" },
        { category: "Dringende Warnsignale (Beine)", step: "beineWarnsignale" }             
      ]
    },
    {step: "Fuß",
      categories:
      [
        { category: "Gelenkschmerzen & Steifheit", step: "beineGelenke" },
        { category: "Muskelbeschwerden & Krämpfe", step: "beineMuskeln" },
        { category: "Nerven, Gefäße & Durchblutung", step: "beineNervenGefaese" },
        { category: "Dringende Warnsignale (Beine)", step: "beineWarnsignale" }             
      ]
    }
  ] 

  return categoryList;
}