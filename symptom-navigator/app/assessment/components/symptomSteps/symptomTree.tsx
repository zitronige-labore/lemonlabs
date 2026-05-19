/*
  component for symptom tree
*/
"use client"

//css import
import assessmentStyles from "../../Assessment.module.css";

// import stmptom steps
import SymptomSelection from "./symptomSelection";
import SymptomCategory from "./symptomCategory";

// imports to access setter functions from page
import type { Dispatch, SetStateAction } from "react";

// import needed types
import { Step, InputMode, SubRegion  } from "../../../types/assessment";

// define props/ get everything needed from page
interface SymptomTreeProps {
  inputMode: InputMode;
  setStep: (step: Step) => void;
  toggleSymptom: (symptom: string) => void;
  setInputMode: (inputMode: InputMode) => void;
  setSelectedSymptoms: Dispatch<SetStateAction<string[]>>;
  selectedSymptoms: string[];
  step: Step;
  selectedSubRegion: SubRegion | null;
  setCopyPainScale:(copyPainScale:Record<string, string>) => void;
  copyPainScale: Record<string, string>;
}

export default function SymptomTree({
  step, 
  selectedSubRegion, 
  selectedSymptoms, 
  inputMode, 
  copyPainScale,
  setSelectedSymptoms,
  setStep, 
  toggleSymptom, 
  setInputMode,
  setCopyPainScale
}: SymptomTreeProps) {
  return (
    
    <>
    {step === "Ohren" && (
                <SymptomCategory
                  categories={[{category: "innenohr", step: "innenOhr"},
                               {category: "aussenohr", step: "aussenOhr"}
                          ]}
                          setStep={setStep}
                          setInputMode={setInputMode}
                          selectedSubRegion={selectedSubRegion}
                >
                </SymptomCategory>
              )}
    
              {step === "aussenOhr" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Schmerz beim Drücken auf den Tragus", schmerzen: true, symptomValue: "Schmerz beim Drücken auf den kleinen Knorpel vor dem Gehörgang" },
                            { symptomName: "Ohrmuschel-Ziehschmerz", schmerzen: true, symptomValue: "Ohrmuschel-Ziehschmerz: Schmerz beim Ziehen am Ohrläppchen oder Knorpel" },
                            { symptomName: "Starkes Jucken im Gehörgang", schmerzen: false, symptomValue: "Juckreiz im Gehörgang: Starkes Jucken, oft verbunden mit Schuppung" },
                            { symptomName: "Ausfluss (Wässrig, eitrig, blutig)", schmerzen: false, symptomValue: "Ausfluss: Wässrig, eitrig, blutig oder bröckelig" },
                            { symptomName: "Gefühl das Ohr sei zugeschwollen", schmerzen: false, symptomValue: "Gehörgangs-Schwellung: Gefühl, das Ohr sei „zugeschwollen“" },
                            { symptomName: "Rötung und Überwärmung der Muschel", schmerzen: true, symptomValue: "Rötung/Überwärmung: Die Muschel ist rot und heiß" },
                            { symptomName: "Kleine Bläschen an der Ohrmuschel", schmerzen: true, symptomValue: "Bläschenbildung: Kleine Bläschen an der Muschel" }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
    
              {step === "innenOhr" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Pulsierender Schmerz (Herzrhythmus)", schmerzen: true, symptomValue: "Pulsierender Schmerz: Schmerz im Rhythmus des Herzschlags" },
                            { symptomName: "Plötzlich einschießender, stechender Schmerz", schmerzen: true, symptomValue: "Stechender Schmerz: Plötzlich einschießend" },
                            { symptomName: "Gefühl von Wasser im Ohr", schmerzen: false, symptomValue: "Völlegefühl: Gefühl, als wäre Wasser im Ohr" },
                            { symptomName: "Eigene Stimme hallt unangenehm laut", schmerzen: false, symptomValue: "Die eigene Stimme hallt unangenehm laut im Ohr wider" },
                            { symptomName: "Knacken oder Klicken beim Schlucken/Gähnen", schmerzen: false, symptomValue: "Knacken/Klicken : Beim Schlucken oder Gähnen" },
                            { symptomName: "Dumpfes Hören (wie unter Wasser)", schmerzen: false, symptomValue: "Dumpfes Hören: Wie „unter Wasser“" },
                            { symptomName: "Ohrlaufen nach plötzlichem Schmerznachlass", schmerzen: false, symptomValue: "Ohrlaufen nach Schmerz: Plötzliches Nachlassen des Schmerzes verbunden mit Ausfluss" },
                            { symptomName: "Tinnitus (Pfeifen, Brummen, Rauschen)", schmerzen: false, symptomValue: "Tinnitus: Pfeifen, Brummen, Rauschen, Zischen, Hämmern" },
                            { symptomName: "Hörsturz (Plötzliche Taubheit)", schmerzen: false, symptomValue: "Hörsturz: Plötzliche, meist einseitige Taubheit ohne erkennbare Ursache" },
                            { symptomName: "Ton wird auf Ohren unterschiedlich hoch gehört", schmerzen: false, symptomValue: "Ein Ton wird auf beiden Ohren unterschiedlich hoch wahrgenommen" }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
        }
  {step === "Kopf" && (
                 <SymptomCategory
                          categories={[
                            { category: "Spannung & Druck im Kopf", step: "kopfSpannung" },
                            { category: "Migräne & Pulsieren", step: "kopfMigraene" },
                            { category: "Cluster-Schmerz & Bohren", step: "kopfCluster" },
                            { category: "Begleiterscheinungen (Kopf)", step: "kopfBegleitung" },
                            { category: "Dringende Warnsignale (Kopf)", step: "kopfWarnsignale" }
                          ]}
                          setStep={setStep}
                          setInputMode={setInputMode}
                          selectedSubRegion={selectedSubRegion}
                      >
                      </SymptomCategory>
              )
        }
              {step === "kopfSpannung" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Dumpfer, drückender Schmerz (beidseitig)", schmerzen: true, symptomValue: "Dumpfer, drückender Schmerz auf beiden Seiten (wie ein zu enges Band um den Kopf)" },
                            { symptomName: "Schmerz zieht vom Hinterkopf zur Stirn", schmerzen: true, symptomValue: "Schmerz zieht vom Hinterkopf hoch bis in die Stirn" },
                            { symptomName: "Schwerer Druck auf dem gesamten Schädel", schmerzen: true, symptomValue: "Gefühl von schwerem Druck auf dem gesamten Schädel, ohne Pulsieren" }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "kopfMigraene" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Einseitiger, hämmernder/pulsierender Schmerz", schmerzen: true, symptomValue: "Einseitiger, hämmernder oder heftig pulsierender Schmerz" },
                            { symptomName: "Schmerz wird bei Bewegung schlimmer", schmerzen: true, symptomValue: "Schmerz verschlimmert sich bei alltäglicher Bewegung (z. B. Treppensteigen, Bücken)" }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "kopfCluster" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Extremer, bohrender Schmerz hinter einem Auge", schmerzen: true, symptomValue: "Extrem starker, unerträglicher, bohrender oder brennender Schmerz streng hinter einem Auge" },
                            { symptomName: "Schmerzattacken nachts oder zur selben Uhrzeit", schmerzen: true, symptomValue: "Schmerz tritt in heftigen Attacken auf, meistens nachts oder zur gleichen Uhrzeit" }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "kopfBegleitung" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Starke Übelkeit oder Drang zum Erbrechen", schmerzen: false, symptomValue: "Starke Übelkeit, flauer Magen oder Drang zum Erbrechen" },
                            { symptomName: "Extreme Licht- oder Lärmempfindlichkeit", schmerzen: false, symptomValue: "Extreme Empfindlichkeit gegen normales Licht, Fernseher oder laute Geräusche" },
                            { symptomName: "Sehen von Flimmern, Zacken oder Mustern (Aura)", schmerzen: false, symptomValue: "Sehen von Flimmern, Zacken, Mustern oder hellen Punkten (bevor der Schmerz anfängt)" }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "kopfWarnsignale" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Explosionsartiger Vernichtungsschmerz", schmerzen: true, symptomValue: "Explosionsartiger Schmerz von einer Sekunde auf die andere (so schlimm wie noch nie)" },
                            { symptomName: "Kopfschmerz mit Fieber und steifem Nacken", schmerzen: true, symptomValue: "Kopfschmerz kombiniert mit Fieber, Schüttelfrost und steifem Nacken" },
                            { symptomName: "Kopfschmerz mit Lähmung oder Sprachstörung", schmerzen: true, symptomValue: "Gleichzeitige Lähmungen im Gesicht/Arm, Sprachstörungen, Sehstörungen oder Verwirrtheit" }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "MagenDarm" && (
                 <SymptomCategory
                          categories={[
                            { category: "Speiseröhre (Schluckbeschwerden)", step: "mdSpeiseroehre" },
                            { category: "Magen (Oberbauch)", step: "mdMagen" },
                            { category: "Darm & Verdauung", step: "mdDarm" },
                            { category: "Leber & Galle", step: "mdGalle" },
                            { category: "Enddarm & Stuhlgang", step: "mdEnddarm" }
                          ]}
                          setStep={setStep}
                          setInputMode={setInputMode}
                          selectedSubRegion={selectedSubRegion}
                      >
                      </SymptomCategory>
              )
              }

              {step === "mdSpeiseroehre" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Sodbrennen (Brennen hinter Brustbein)", schmerzen: true, symptomValue: "Sodbrennen: Brennendes Gefühl hinter dem Brustbein, oft nach dem Essen oder im Liegen." },
                            { symptomName: "Saures Aufstoßen von Magensaft", schmerzen: false, symptomValue: "Saures Aufstoßen: Rückfluss von Magensaft oder Speiseresten bis in den Mundraum." },
                            { symptomName: "Schluckstörung (Nahrung bleibt stecken)", schmerzen: true, symptomValue: "Schluckstörung: Das Gefühl, dass Nahrung im Hals oder in der Brust „stecken bleibt“." },
                            { symptomName: "Kloßgefühl im Hals (Globusgefühl)", schmerzen: false, symptomValue: "Kloßgefühl: Ein ständiges Druck- oder Fremdkörpergefühl im Halsbereich." },
                            { symptomName: "Schmerz direkt beim Schluckvorgang", schmerzen: true, symptomValue: "Schmerz beim Schlucken: Stechender Schmerz direkt beim Schluckvorgang." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "mdMagen" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Magendruck unter dem Brustbein", schmerzen: true, symptomValue: "Magendruck: Unangenehmer Druck oder Schmerz direkt unter dem Brustbein (Oberbauch)." },
                            { symptomName: "Völlegefühl nach kleinsten Portionen", schmerzen: false, symptomValue: "Völlegefühl: Gefühl, bereits nach sehr kleinen Portionen „pappsatt“ zu sein." },
                            { symptomName: "Nüchternschmerz (besser nach dem Essen)", schmerzen: true, symptomValue: "Nüchternschmerz: Magenschmerzen bei leerem Magen, die nach dem Essen oft besser werden." },
                            { symptomName: "Übelkeit & Erbrechen von Mageninhalt", schmerzen: false, symptomValue: "Übelkeit & Erbrechen: Flaues Gefühl im Magen bis hin zum Erbrechen von Mageninhalt." },
                            { symptomName: "Kaffeesatz-Erbrechen (Dunkel & krümelig)", schmerzen: true, symptomValue: "Kaffeesatz-Erbrechen: Dunkles, krümeliges Erbrochenes (Sofortiger Notfall!)." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }

              {step === "mdDarm" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Plötzliche, wellenartige Bauchkrämpfe", schmerzen: true, symptomValue: "Bauchkrämpfe: Plötzlich einschießende, wellenartige Schmerzen im ganzen Bauch." },
                            { symptomName: "Praller, harter Blähbauch (zu viel Luft)", schmerzen: true, symptomValue: "Blähbauch: Der Bauch ist prall, hart und schmerzhaft durch zu viel Luft." },
                            { symptomName: "Durchfall (öfter als 3-mal am Tag)", schmerzen: false, symptomValue: "Durchfall: Wässriger oder sehr weicher Stuhl (öfter als 3-mal am Tag)." },
                            { symptomName: "Verstopfung / Sehr harter Stuhlgang", schmerzen: true, symptomValue: "Verstopfung: Seltener Stuhlgang (weniger als 3-mal pro Woche) oder sehr harter Stuhl." },
                            { symptomName: "Fettstuhl (glänzend, schwimmt oben)", schmerzen: false, symptomValue: "Fettstuhl: Glänzender, klebriger Stuhl, der in der Toilette oben schwimmt." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "mdGalle" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Gelbverfärbung der Haut / Augenweiß", schmerzen: false, symptomValue: "Gelbsucht: Gelbverfärbung des Augenweiß oder der Haut." },
                            { symptomName: "Gallenkolik (Krämpfe im rechten Oberbauch)", schmerzen: true, symptomValue: "Gallenkolik: Heftige, krampfartige Schmerzen im rechten Oberbauch." },
                            { symptomName: "Auffällig dunkler Urin (Cola-Farbe)", schmerzen: false, symptomValue: "Dunkler Urin: Urin ist auffällig dunkel (wie Cola oder dunkles Bier)." },
                            { symptomName: "Sandfarbener, fast weißer Stuhlgang", schmerzen: false, symptomValue: "Heller Stuhl: Der Stuhlgang ist sandfarben oder fast weiß entfärbt." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "mdEnddarm" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Teerstuhl (Tiefschwarz & glänzend)", schmerzen: false, symptomValue: "Teerstuhl: Tiefschwarzer, glänzender und klebriger Stuhl (Inneres Bluten!)." },
                            { symptomName: "Frisches, hellrotes Blut auf dem Stuhl", schmerzen: false, symptomValue: "Frisches Blut: Hellrote Blutspuren auf dem Stuhl oder am Toilettenpapier." },
                            { symptomName: "Bleistiftstuhl (Auffällig dünner Stuhl)", schmerzen: false, symptomValue: "Bleistiftstuhl: Auffällig dünn geformter Stuhl." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "ArmeHaende" && (
                 <SymptomCategory
                          categories={[
                            { category: "Schulter & Oberarm", step: "armSchulter" },
                            { category: "Ellbogen & Unterarm", step: "armEllbogen" },
                            { category: "Handgelenk & Finger", step: "armHandFinger" },
                            { category: "Neurologie, Gefäße & Warnsignale", step: "armGefaesse" }
                          ]}
                          setStep={setStep}
                          setInputMode={setInputMode}
                          selectedSubRegion={selectedSubRegion}
                      >
                      </SymptomCategory>
              )
              }

              {step === "armSchulter" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Stechender Schmerz beim seitlichen Anheben", schmerzen: true, symptomValue: "Impingement-Syndrom: Stechender Schmerz beim seitlichen Anheben des Arms (zwischen 60° und 120°)." },
                            { symptomName: "Starkes Schulterpochen nachts (Liegen unmöglich)", schmerzen: true, symptomValue: "Nachtschmerz: Starkes Pochen in der Schulter; Liegen auf der betroffenen Seite ist unmöglich." },
                            { symptomName: "Knirschen/Reibegeräusche im Schultergelenk", schmerzen: false, symptomValue: "Knirschen (Krepitation): Hörbare oder spürbare Reibegeräusche im Gelenk bei kreisenden Bewegungen." },
                            { symptomName: "Plötzlicher Knall mit Muskelvorwölbung", schmerzen: true, symptomValue: "Bizepssehnen-Ruptur: Plötzlicher \"Knall\" mit anschließender Vorwölbung des Muskelbauchs (\"Popeye-Syndrom\")." },
                            { symptomName: "Punktueller, messerscharfer Schmerz bei Bewegung", schmerzen: true, symptomValue: "Muskelkater vs. Riss: Diffuser Druckschmerz nach Sport vs. punktueller, messerscharfer Schmerz bei Bewegung." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "armEllbogen" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Elektrisierende Schläge bis in den Ringfinger", schmerzen: true, symptomValue: "Sulcus-Ulnaris-Syndrom: Elektrisierende Schläge bis in den Ringfinger bei Druck auf die Ellbogen-Innenseite." },
                            { symptomName: "Rote, heiße Schwellung auf der Ellbogenspitze", schmerzen: true, symptomValue: "Bursitis (Schleimbeutel): Prall-elastische, oft rote und heiße Schwellung direkt auf der Ellbogenspitze." },
                            { symptomName: "Schmerz beim kräftigen Ausdrehen der Hand", schmerzen: true, symptomValue: "Suppinationsschmerz: Schmerz beim kräftigen Ausdrehen der Hand (z. B. Schraubbewegung)." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "armHandFinger" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Einschlafen der Hand nachts (Daumen/Mittelfinger)", schmerzen: false, symptomValue: "Karpaltunnelsyndrom: Einschlafen der Hand nachts (Daumen bis Mittelfinger), Schmerzlinderung durch Schütteln." },
                            { symptomName: "Sichtbares Loch / flacher Daumenballen", schmerzen: false, symptomValue: "Karpaltunnel-Atrophie: Sichtbares \"Loch\" oder flacher Daumenballen durch langjährigen Nervendruck." },
                            { symptomName: "Unfähigkeit die Hand nach oben zu strecken", schmerzen: false, symptomValue: "Fallhand: Unfähigkeit, die Hand im Handgelenk nach oben zu strecken (Radialis-Lähmung)." },
                            { symptomName: "Tastbare Knoten in Innenhand (Strecken unmöglich)", schmerzen: false, symptomValue: "Dupuytren-Kontraktur: Tastbare Knoten oder Stränge in der Innenhand; Finger lassen sich nicht mehr flach auflegen." },
                            { symptomName: "Finger bleibt in Beugung hängen und schnappt", schmerzen: true, symptomValue: "Trigger-Finger: Finger bleibt in Beugung hängen und \"schnappt\" erst bei Kraftaufwand auf." },
                            { symptomName: "Harte, knöcherne Verdickungen an Fingergelenken", schmerzen: true, symptomValue: "Arthrose-Knoten: Harte, knöcherne Verdickungen an den Fingergelenken (Heberden- & Bouchard-Knoten)." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "armGefaesse" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Brennen, Kribbeln oder Ameisenlaufen", schmerzen: false, symptomValue: "Parästhesien: Brennen, Kribbeln oder \"Ameisenlaufen\" ohne äußeren Reiz." },
                            { symptomName: "Normale Berührung wird als schmerzhaft empfunden", schmerzen: true, symptomValue: "Dysästhesie: Missempfindung: Normale Berührung wird als unangenehm oder schmerzhaft empfunden." },
                            { symptomName: "Verlust der Trennung von zwei Berührungspunkten", schmerzen: false, symptomValue: "Diskriminierung: Verlust der Fähigkeit, zwei Berührungspunkte getrennt wahrzunehmen." },
                            { symptomName: "Fingernagel braucht > 2 Sek. um rosa zu werden", schmerzen: false, symptomValue: "Kapillarfüllzeit: Nach Druck auf den Nagel dauert es länger als 2 Sek., bis er wieder rosa wird." },
                            { symptomName: "Unerträglicher Schmerz, Haut blass & kalt", schmerzen: true, symptomValue: "Ischämieschmerz: Unerträglicher Schmerz bei blasser, kalter Haut (Gefäßverschluss - Notfall!)." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "Hals" && (
                 <SymptomCategory
                          categories={[
                            { category: "Mandeln & Mundhöhle", step: "halsMandeln" },
                            { category: "Rachenwand & Schlucken", step: "halsRachen" },
                            { category: "Kehlkopf & Luftröhre", step: "halsKehlkopf" },
                            { category: "Lymphknoten & Drüsen", step: "halsDruesen" }
                          ]}
                          setStep={setStep}
                          setInputMode={setInputMode}
                          selectedSubRegion={selectedSubRegion}
                      >
                      </SymptomCategory>
              )
              }
              {step === "halsMandeln" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Kloßige Sprache (heiße Kartoffel im Mund)", schmerzen: false, symptomValue: "Kloßige Sprache: „Klingt, als hätte man eine heiße Kartoffel im Mund\"" },
                            { symptomName: "Kiefersperre (Mund geht nicht weit auf)", schmerzen: true, symptomValue: "Kiefersperre (Mund lässt sich nicht weit öffnen)" },
                            { symptomName: "Extremer, auffälliger Mundgeruch", schmerzen: false, symptomValue: "Extremer Mundgeruch" },
                            { symptomName: "Eine Mandel drückt das Gaumensegel zur Seite", schmerzen: true, symptomValue: "Einseitige Vorwölbung: Eine Mandel drückt das Gaumensegel zur Seite" }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "halsRachen" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Kloß im Hals ohne echtes Hindernis", schmerzen: false, symptomValue: "Globusgefühl: „Kloß im Hals“ ohne echtes Hindernis beim Schlucken" },
                            { symptomName: "Gefühl Schleim laufe den Rachen runter", schmerzen: false, symptomValue: "Ständiges Gefühl, Schleim laufe von oben den Rachen runter" },
                            { symptomName: "Räusperzwang (Ständiger Drang frei zu machen)", schmerzen: false, symptomValue: "Räusperzwang: Ständiger Drang, den Hals freizumachen" },
                            { symptomName: "Trockenes Kratzen im Hals (morgens)", schmerzen: false, symptomValue: "Trockenes Kratzen: Besonders morgens nach dem Aufstehen" }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "halsKehlkopf" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Heiserkeit / Wegbrechen der Stimme", schmerzen: false, symptomValue: "Heiserkeit: Rauigkeit, behauchte Stimme, Wegbrechen der Stimme" },
                            { symptomName: "Kompletter Stimmenverlust (nur noch Flüstern)", schmerzen: false, symptomValue: "Kompletter Stimmenverlust (man kann nur noch flüstern)" },
                            { symptomName: "Pfeifendes Geräusch beim Einatmen (Stridor)", schmerzen: false, symptomValue: "Inspirations-Stridor: Pfeifendes Geräusch beim Einatmen (Engstelle oben)" },
                            { symptomName: "Pfeifendes Geräusch beim Ausatmen (Stridor)", schmerzen: false, symptomValue: "Exspirations-Stridor: Pfeifendes Geräusch beim Ausatmen (Engstelle tiefer)" },
                            { symptomName: "Bellender, trockener, metallischer Husten", schmerzen: false, symptomValue: "Bellender Husten: Hart, trocken, metallisch klingend" },
                            { symptomName: "Stechender Schmerz beim Sprechen strahlt zum Ohr", schmerzen: true, symptomValue: "Stechender Schmerz beim Sprechen: Schmerz strahlt oft zum Ohr aus" }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
              {step === "halsDruesen" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Lymphknoten druckschmerzhaft (Entzündung)", schmerzen: true, symptomValue: "Druckschmerzhaft: Meist Zeichen einer Entzündung." },
                            { symptomName: "Lymphknoten schmerzlos & hart (Warnsignal)", schmerzen: false, symptomValue: "Schmerzlos & Hart: Warnsignal (muss abgeklärt werden)" },
                            { symptomName: "Lymphknoten unter der Haut verschieblich", schmerzen: false, symptomValue: "Verschieblich: „Kugel“ lässt sich unter der Haut bewegen" },
                            { symptomName: "Lymphknoten fest mit Untergrund verbacken", schmerzen: false, symptomValue: "Verbacken: Gewebe fühlt sich fest mit dem Untergrund verbunden an" }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
            
             {(step === "RueckenOben" || step === "RueckenUnten") && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Hexenschuss (Akuter, einschießender Schmerz)", schmerzen: true, symptomValue: "Lumbago: Akut einschießender, blockierender Schmerz im Lendenwirbelbereich." },
                            { symptomName: "Ausstrahlender Schmerz ins Bein mit Kribbeln", schmerzen: true, symptomValue: "Ischialgie: Schmerz strahlt über das Gesäß bis in den Fuß aus, teils mit Taubheitsgefühl." },
                            { symptomName: "Morgensteifigkeit der Wirbelsäule (> 30 Min.)", schmerzen: true, symptomValue: "Morgensteifigkeit: Wirbelsäule ist nach dem Aufstehen spürbar steif, Besserung durch Bewegung." },
                            { symptomName: "Schmerz verstärkt sich beim tiefen Einatmen", schmerzen: true, symptomValue: "Interkostal-Schmerz: Schmerz zieht gürtelförmig um den Brustkorb, atemabhängig." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }

              {(step === "Becken" || step === "Genitalbereich") && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Brennen oder Schmerzen beim Wasserlassen", schmerzen: true, symptomValue: "Dysurie: Brennender Schmerz beim Urinieren, häufig kombiniert mit starkem Harndrang." },
                            { symptomName: "Ziehender Schmerz im Unterleib / Beckenboden", schmerzen: true, symptomValue: "Beckenbodenschmerz: Diffuser, ziehender Druck im Tiefbecken." },
                            { symptomName: "Rötung, starker Juckreiz oder Schwellung", schmerzen: false, symptomValue: "Lokale Irritation: Juckreiz, Rötung oder Schwellung der Schleimhäute." },
                            { symptomName: "Auffälliger Ausfluss (Geruch / Farbe verändert)", schmerzen: false, symptomValue: "Veränderter Fluor: Ungewöhnlicher Ausfluss aus dem Genitalbereich." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }

              {(step === "Oberschenkel" || step === "Knie" || step === "Unterschenkel" || step === "Fuß") && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Einseitig geschwollene, heiße, rote Wade", schmerzen: true, symptomValue: "Thrombose-Verdacht: Einseitige Schwellung der Wade, dumpfer Ziehschmerz (Notfall!)." },
                            { symptomName: "Belastungsabhängiger Knieschmerz (Anlaufschmerz)", schmerzen: true, symptomValue: "Arthrose-Verdacht: Schmerz besonders bei den ersten Schritten am Morgen oder nach Pausen." },
                            { symptomName: "Schaufensterkrankheit (Wadenkrampf beim Gehen)", schmerzen: true, symptomValue: "pAVK: Zwingende Gehpausen nach kurzen Strecken wegen massiver Krampfschmerzen." },
                            { symptomName: "Umknicktrauma mit sofortiger Schwellung", schmerzen: true, symptomValue: "Distorsion: Akuter Schmerz nach Umknicken, sichtbares Hämatom am Knöchel." },
                            { symptomName: "Stechender Fersenschmerz am Morgen (Auftreten)", schmerzen: true, symptomValue: "Fersensporn: Messerscharfer Schmerz an der Fußsohle beim ersten Auftreten." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }

              {step === "AllgemeinesBefinden" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Schüttelfrost / Unkontrollierbares Zittern", schmerzen: false, symptomValue: "Schüttelfrost: Unkontrollierbares Zittern am ganzen Körper bei rasant steigendem Fieber." },
                            { symptomName: "Unerklärlicher, schneller Gewichtsverlust", schmerzen: false, symptomValue: "Gewichtsverlust: Ungewollte Gewichtsabnahme ohne Diät oder Ernährungsumstellung." },
                            { symptomName: "Anhaltende Nachtschweiße (Kleidungswechsel nötig)", schmerzen: false, symptomValue: "B-Symptomatik: Massives Schwitzen in der Nacht, sodass Schlafkleidung gewechselt werden muss." },
                            { symptomName: "Ausgeprägte, bleierne Müdigkeit und Abgeschlagenheit", schmerzen: false, symptomValue: "Fatigue/Schwäche: Extreme Antriebslosigkeit, die den Alltag massiv einschränkt." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                      >
                      </SymptomSelection>
              )
              }
          
    </>
  );
}