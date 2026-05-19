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
import { Step, InputMode, SubRegion, BasisData  } from "../../../types/assessment";

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
  basisdata: BasisData;
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
  setCopyPainScale,
  basisdata
}: SymptomTreeProps) {

  const gender = basisdata.gender;

  return (

    <>
              {/* --- OHREN --- */}
              {step === "Ohren" && (
                <SymptomCategory
                  categories={[
                    { category: "innenohr", step: "innenOhr" },
                    { category: "aussenohr", step: "aussenOhr" }
                  ]}
                  setStep={setStep}
                  setInputMode={setInputMode}
                  selectedSubRegion={selectedSubRegion}
                />
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
                 />
              )}
    
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
                 />
              )}

              {/* --- AUGEN --- */}
              {(step === "Augen" || step === "augen") && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Plötzlicher Sehverlust / Erblindung (einseitig)", schmerzen: false, symptomValue: "Sehverlust: Akute, schmerzlose Erblindung oder massive Sehverschlechterung auf einem Auge innerhalb von Sekunden/Minuten (Verdacht auf Gefäßverschluss)." },
                            { symptomName: "Sehen von Doppelbildern ", schmerzen: false, symptomValue: "Doppelbilder: Gleichzeitiges Sehen von zwei Bildern eines einzelnen Objekts (wichtiges neurologisches Warnsignal)." },
                            { symptomName: "Heftiger Augenschmerz + Rötung + Sehfehlen", schmerzen: true, symptomValue: "Glaukom-Anfall: Extrem starker, akuter Augenschmerz, oft ausstrahlend in den Kopf, begleitet von einem geröteten, steinharten Auge und Sehverschlechterung (Sehen von Regenbogenhöfen)." },
                            { symptomName: "Lichtblitze oder herabfallender Rußregen", schmerzen: false, symptomValue: "Netzhaut-Warnsignale: Wahrnehmung von plötzlichen Lichtblitzen (besonders bei Augenbewegung) oder massenhaft dunklen Punkten/Schleiern (\"Rußregen\")." },
                            { symptomName: "Zunehmender Schatten / Vorhang im Gesichtsfeld", schmerzen: false, symptomValue: "Gesichtsfeldausfall: Von oben, unten oder der Seite heranziehender dunkler Schatten oder \"Vorhang\" (Verdacht auf Netzhautablösung)." },
                            { symptomName: "Starke Fremdkörper- oder Hornhautschmerzen", schmerzen: true, symptomValue: "Hornhautverletzung: Stechender, kontinuierlicher Schmerz, extremes Fremdkörpergefühl, starker Tränenfluss und krampfhaftes Schließen der Augenlider." },
                            { symptomName: "Eitriges Sekret und verklebte Lider", schmerzen: false, symptomValue: "Konjunktivitis (eitrig): Deutlich gelb-grünliches Sekret, besonders morgens stark verklebte Augenlider, gerötete Bindehaut." },
                            { symptomName: "Wässriges Sekret, Juckreiz und Brennen", schmerzen: false, symptomValue: "Konjunktivitis (allergisch/viral): Klares, wässriges Sekret, oft begleitet von starkem Juckreiz, Brennen und geschwollenen Lidrändern." },
                            { symptomName: "Extreme Lichtempfindlichkeit ", schmerzen: false, symptomValue: "Lichtempfindlichkeit: Schmerzhaftes oder unerträgliches Gefühl bei normalem Tages- oder Raumlicht, zwingt zum Zukneifen der Augen." },
                            { symptomName: "Verzerrtsehen / Wellige Linien", schmerzen: false, symptomValue: "Verzerrtsehen: Gerade Linien (z. B. Fliesenbaufugen, Textzeilen) erscheinen verbogen, wellig oder verzerrt (Hinweis auf Makulaerkrankung)." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- NASE --- */}
              {(step === "Nase" || step === "nase") && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Starkes, unstillbares Nasenbluten", schmerzen: false, symptomValue: "Nasenbluten heftig: Ununterbrochener, starker Blutfluss (auch im Rachen spürbar), der sich durch normale Kompression (Nasenflügel zusammendrücken) nach 10-15 Minuten nicht stoppen lässt." },
                            { symptomName: "Eitriger Schnupfen + drückender Gesichtsschmerz", schmerzen: true, symptomValue: "Akute Sinusitis: Gelb-grünes, zähflüssiges Nasensekret gepaart mit drückendem oder klopfendem Schmerz über den Stirn- oder Kieferhöhlen, der sich beim Bücken oder Auftreten massiv verstärkt." },
                            { symptomName: "Völliger oder plötzlicher Verlust des Geruchssinns", schmerzen: false, symptomValue: "Anosmie: Akuter, vollständiger Verlust der Riechfähigkeit (und konsequent des Geschmackssinns) ohne oder mit Schnupfen." },
                            { symptomName: "Einseitige Verstopfung mit üblem Geruch", schmerzen: false, symptomValue: "Einseitige nasale Obstruktion: Nur ein Nasenloch ist chronisch verstopft, oft begleitet von eitrig-blutigem, auffällig faulig oder übel riechendem Sekret (Verdacht auf Fremdkörper oder Gewebeveränderung)." },
                            { symptomName: "Wässriges Dauerrinnen + Niesreiz", schmerzen: false, symptomValue: "Rhinitis (allergisch): Ständiges Fließsymptom mit glasklarem, wässrigem Sekret, Attacken von Serien-Niesen, oft juckende oder brennende Nasenschleimhaut." },
                            { symptomName: "Austritt von glasklarer Flüssigkeit nach Kopfverletzung", schmerzen: false, symptomValue: "Rhinorrhö (Liquorverdacht): Unstillbares Laufen von spiegelklarer, wässriger Flüssigkeit aus der Nase nach einem Sturz oder Schlag auf den Kopf (Verdacht auf Schädelbasisbruch)." },
                            { symptomName: "Trockene Schleimhäute mit schmerzhafter Borkenbildung", schmerzen: true, symptomValue: "Rhinitis sicca: Extrem trockenes Gefühl in der Nase, schmerzhafte Krusten- und Borkenbildung, die beim Lösen leicht blutet." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- KOPF --- */}
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
                 />
              )}

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
                 />
              )}

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
                 />
              )}

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
                 />
              )}

              {step === "kopfBegleitung" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Starke Übelkeit oder Drang zum Erbrechen", schmerzen: false, symptomValue: "Starke Übelkeit, flauer Magen oder Drang zum Erbrechen" },
                            { symptomName: "Extreme Licht- oder Lärmempfindlichkeit", schmerzen: false, symptomValue: "Extreme Empfindlichkeit gegen normales Licht, Fernseher oder laute Geräusche" },
                            { symptomName: "Sehen von Flimmern, Zacken oder Mustern ", schmerzen: false, symptomValue: "Sehen von Flimmern, Zacken, Mustern oder hellen Punkten (bevor der Schmerz anfängt)" }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

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
                 />
              )}
              {/* --- NACKEN KATEGORIEN --- */}
              {step === "Nacken" && (
                 <SymptomCategory
                          categories={[
                            { category: "Verspannung & Bewegungsschmerz", step: "nackenBewegung" },
                            { category: "Dringende Warnsignale (Nacken)", step: "nackenWarnsignale" }
                          ]}
                          setStep={setStep}
                          setInputMode={setInputMode}
                          selectedSubRegion={selectedSubRegion}
                 />
              )}

              {/* --- NACKEN: BEWEGUNG & VERSPANNUNG --- */}
              {step === "nackenBewegung" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Schmerzhafte Muskelverhärtung (Myogelose)", schmerzen: true, symptomValue: "Nackensteife muskulär: Deutlich tastbare, harte und schmerzhafte Knubbel oder Stränge in der Nacken- und Schultermuskulatur." },
                            { symptomName: "Eingeschränkte Drehung / Steifer Hals", schmerzen: true, symptomValue: "Bewegungseinschränkung: Der Kopf lässt sich nur unter starken Schmerzen oder blockiert zu einer Seite drehen oder neigen." },
                            { symptomName: "Knirschen bei Kopfbewegungen", schmerzen: false, symptomValue: "HWS-Krepitation: Hörbares oder spürbares Reiben und Knacken in der Halswirbelsäule beim Kreisen des Kopfes." },
                            { symptomName: "Ziehender Schmerz strahlt in den Hinterkopf", schmerzen: true, symptomValue: "Zervikalgie: Schmerzen im Nacken, die bandförmig nach oben in den Hinterkopf ziehen und dort Kopfschmerzen auslösen." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- NACKEN: WARNSIGNALE --- */}
              {step === "nackenWarnsignale" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Nackensteife: Kopf kann nicht auf die Brust gelegt werden", schmerzen: true, symptomValue: "Meningismus (Red Flag): Extreme, schmerzhafte Blockade beim Versuch, das Kinn passiv auf die Brust zu legen, oft mit Fieber oder Lichtempfindlichkeit (Verdacht auf Hirnhautentzündung)." },
                            { symptomName: "Schmerz strahlt elektrisierend in den Arm aus", schmerzen: true, symptomValue: "Wurzelkompression HWS: Messerscharfer oder elektrisierender Schmerz, der über die Schulter bis in die Finger zieht, evtl. mit Taubheitsgefühl (Bandscheibenvorfall HWS)." },
                            { symptomName: "Schwindel oder Sehstörungen bei Kopfdrehung", schmerzen: false, symptomValue: "Zervikaler Schwindel: Auftreten von Drehschwindel, Gangunsicherheit oder flimmernden Augen direkt bei schnellen Kopfbewegungen." },
                            { symptomName: "Nackenschmerz nach Sturz oder Unfall (Peitschenhieb)", schmerzen: true, symptomValue: "HWS-Trauma: Akut einsetzende Schmerzen nach einem Auffahrunfall, Sturz oder heftigem Ruck (Verdacht auf Schleudertrauma/Fraktur)." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- MUND & ZÄHNE KATEGORIEN --- */}
              {(step === "Mund" || step === "Zaehne" || step === "MundZaehne") && (
                 <SymptomCategory
                          categories={[
                            { category: "Zahnschmerzen & Kieferbeschwerden", step: "mundZaehneSchmerz" },
                            { category: "Zahnfleisch & Mundschleimhaut", step: "mundZaehneSchleimhaut" }
                          ]}
                          setStep={setStep}
                          setInputMode={setInputMode}
                          selectedSubRegion={selectedSubRegion}
                 />
              )}

              {/* --- MUND & ZÄHNE: SCHMERZEN --- */}
              {step === "mundZaehneSchmerz" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Pulsierender, klopfender Zahnschmerz", schmerzen: true, symptomValue: "Pulpitis-Verdacht: Anhaltender, heftiger und rhythmisch klopfender Schmerz im Zahn, der sich im Liegen oder bei Wärme massiv verstärkt." },
                            { symptomName: "Empfindlichkeit bei Kälte, Wärme oder Süßem", schmerzen: true, symptomValue: "Überempfindliche Zahnhälse: Kurz einschießender, stechender Schmerz bei Kontakt mit kalten, heißen oder süßen Speisen/Getränken." },
                            { symptomName: "Aufbissschmerz / Schmerz beim Kauen", schmerzen: true, symptomValue: "Parodontitis/Wurzelspitze: Der Zahn schmerzt intensiv, sobald Druck von oben auf ihn ausgeübt wird oder beim Zusammenbeißen." },
                            { symptomName: "Nächtliches Zähneknirschen / Kieferschmerzen am Morgen", schmerzen: true, symptomValue: "Bruxismus/CMD: Dumpfer Druckschmerz im Kiefergelenk und den Schläfen direkt nach dem Aufwachen, oft mit Verspannungen." },
                            { symptomName: "Schmerzhafte Schwellung der Wange (\"Dicke Backe\")", schmerzen: true, symptomValue: "Abszess (Red Flag): Rasch zunehmende, heiße Schwellung im Gesicht oder am Kiefer, teils mit Fieber oder Schluckbeschwerden (Sofortiger Behandlungsbedarf)." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- MUND & ZÄHNE: SCHLEIMHAUT --- */}
              {step === "mundZaehneSchleimhaut" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Zahnfleischbluten beim Zähneputzen", schmerzen: false, symptomValue: "Gingivitis: Leicht auslösbare Blutungen am Zahnfleischrand, oft begleitet von Rötung und Schwellung." },
                            { symptomName: "Schmerzhafte, kleine Bläschen/Geschwüre (Aphten)", schmerzen: true, symptomValue: "Aphten: Kleine, rundliche, weiß-gelblich belegte Schleimhautdefekte mit rotem Rand, die beim Essen und Sprechen stark brennen." },
                            { symptomName: "Weißer, abwischbarer Belag (Mundsoor)", schmerzen: false, symptomValue: "Candidose: Trockenes Gefühl im Mund gepaart mit stippchenartigen, weißen Belägen auf der Zunge oder Wangeninnenseite, die sich abwischen lassen." },
                            { symptomName: "Anhaltende Mundtrockenheit (Xerostomie)", schmerzen: false, symptomValue: "Mundtrockenheit: Zu geringer Speichelfluss, brennendes Gefühl auf der Zunge, Erschwerung beim Schlucken trockener Nahrung." },
                            { symptomName: "Chronisch gerötete, brennende Zunge", schmerzen: true, symptomValue: "Zungenbrennen: Missempfindungen oder brennender Schmerz auf der Zungenoberfläche ohne sichtbare Verletzung (z.B. bei Vitaminmangel)." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- OBERBAUCH --- */}
              {step === "Oberbauch" && (
                 <SymptomCategory
                          categories={[
                            { category: "Speiseröhre (Schluckbeschwerden)", step: "mdSpeiseroehre" },
                            { category: "Magen (Oberbauch)", step: "mdMagen" },
                            { category: "Leber & Galle", step: "mdGalle" }
                          ]}
                          setStep={setStep}
                          setInputMode={setInputMode}
                          selectedSubRegion={selectedSubRegion}
                 />
              )}

              {step === "mdSpeiseroehre" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Sodbrennen (Brennen hinter Brustbein)", schmerzen: true, symptomValue: "Sodbrennen: Brennendes Gefühl hinter dem Brustbein, oft nach dem Essen oder im Liegen." },
                            { symptomName: "Saures Aufstoßen von Magensaft", schmerzen: false, symptomValue: "Saures Aufstoßen: Rückfluss von Magensaft oder Speiseresten bis in den Mundraum." },
                            { symptomName: "Schluckstörung (Nahrung bleibt stecken)", schmerzen: true, symptomValue: "Schluckstörung: Das Gefühl, dass Nahrung im Hals oder in der Brust „stecken bleibt“." },
                            { symptomName: "Kloßgefühl im Hals", schmerzen: false, symptomValue: "Kloßgefühl: Ein ständiges Druck- oder Fremdkörpergefühl im Halsbereich." },
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
                 />
              )}

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
                 />
              )}

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
                 />
              )}

              {/* --- UNTERBAUCH --- */}
              {step === "Unterbauch" && (
                 <SymptomCategory
                          categories={[
                            { category: "Darm & Verdauung", step: "mdDarm" },
                            { category: "Leber & Galle", step: "mdGalle" },
                            { category: "Enddarm & Stuhlgang", step: "mdEnddarm" }
                          ]}
                          setStep={setStep}
                          setInputMode={setInputMode}
                          selectedSubRegion={selectedSubRegion}
                 />
              )}

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
                 />
              )}
              
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
                 />
              )}

              {/* --- ARME / SCHULTER / HÄNDE --- */}
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
                 />
              )}

              {/* Erfüllt armSchulter ODER Oberarm */}
              {(step === "armSchulter" || step === "Oberarm") && (
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
                 />
              )}

              {/* Erfüllt armEllbogen / armHandFinger ODER Unterarm */}
              {(step === "armEllbogen" || step === "armHandFinger" || step === "Unterarm" || step === "Hand") && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Elektrisierende Schläge bis in den Ringfinger", schmerzen: true, symptomValue: "Sulcus-Ulnaris-Syndrom: Elektrisierende Schläge bis in den Ringfinger bei Druck auf die Ellbogen-Innenseite." },
                            { symptomName: "Rote, heiße Schwellung auf der Ellbogenspitze", schmerzen: true, symptomValue: "Bursitis (Schleimbeutel): Prall-elastische, oft rote und heiße Schwellung direkt auf der Ellbogenspitze." },
                            { symptomName: "Schmerz beim kräftigen Ausdrehen der Hand", schmerzen: true, symptomValue: "Suppinationsschmerz: Schmerz beim kräftigen Ausdrehen der Hand (z. B. Schraubbewegung)." },
                            { symptomName: "Einschlafen der Hand nachts (Daumen/Mittelfinger)", schmerzen: false, symptomValue: "Karpaltunnelsyndrom: Einschlafen der Hand nachts (Daumen bis Mittelfinger), Schmerzlinderung durch Schütteln." },
                            { symptomName: "Sichtbares Loch / flacher Daumenballen", schmerzen: false, symptomValue: "Karpaltunnel-Atrophie: Sichtbares \"Loch\" oder flacher Daumenballen durch langjährigen Nervendruck." },
                            { symptomName: "Unfähigkeit die Hand nach oben zu strecken", schmerzen: false, symptomValue: "Fallhand: Unfähigkeit, die Hand im Handgelenk nach oben zu strecken (Radialis-Lähmung)." },
                            { symptomName: "Tastbare Knoten in Innenhand (Strecken unmöglich)", schmerzen: false, symptomValue: "Dupuytren-Kontraktur: Tastbare Knoten oder Stränge in der Innenhand; Finger lassen sich nicht mehr flach auflegen." },
                            { symptomName: "Finger bleibt in Beugung hängen und schnappt", schmerzen: true, symptomValue: "Trigger-Finger: Finger bleibt in Beugung hängen und \"schnappt\" erst bei Kraftaufwand auf." },
                            { symptomName: "Härte, knöcherne Verdickungen an Fingergelenken", schmerzen: true, symptomValue: "Arthrose-Knoten: Harte, knöcherne Verdickungen an den Fingergelenken (Heberden- & Bouchard-Knoten)." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}
          
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
                 />
              )}

              {/* --- HALS --- */}
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
                 />
              )}

              {step === "halsMandeln" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Kloßige Sprache ", schmerzen: false, symptomValue: "Kloßige Sprache: „Klingt, als hätte man eine heiße Kartoffel im Mund\"" },
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
                 />
              )}

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
                 />
              )}

              {step === "halsKehlkopf" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Heiserkeit / Wegbrechen der Stimme", schmerzen: false, symptomValue: "Heiserkeit: Rauigkeit, behauchte Stimme, Wegbrechen der Stimme" },
                            { symptomName: "Kompletter Stimmenverlust (nur noch Flüstern)", schmerzen: false, symptomValue: "Kompletter Stimmenverlust (man kann nur noch flüstern)" },
                            { symptomName: "Pfeifendes Geräusch beim Einatmen ", schmerzen: false, symptomValue: "Inspirations-Stridor: Pfeifendes Geräusch beim Einatmen (Engstelle oben)" },
                            { symptomName: "Pfeifendes Geräusch beim Ausatmen", schmerzen: false, symptomValue: "Exspirations-Stridor: Pfeifendes Geräusch beim Ausatmen (Engstelle tiefer)" },
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
                 />
              )}

              {step === "halsDruesen" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Lymphknoten druckschmerzhaft", schmerzen: true, symptomValue: "Druckschmerzhaft: Meist Zeichen einer Entzündung." },
                            { symptomName: "Lymphknoten schmerzlos & hart", schmerzen: false, symptomValue: "Schmerzlos & Hart: Warnsignal (muss abgeklärt werden)" },
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
                 />
              )}
            
              {/* --- BRUST LINKS / RECHTS --- */}
              {(step === "Brust links" || step === "Brust rechts") && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Engegefühl, massiver Druck oder Brennen (Red Flag)", schmerzen: true, symptomValue: "Akuter Brustschmerz: Dumpfer, drückender oder brennender Schmerz („Elefant auf der Brust“), evtl. Ausstrahlung in Arm/Kiefer (Sofortiger Notfall!)." },
                            { symptomName: "Atemnot / Luftnot schon im Ruhezustand (Red Flag)", schmerzen: false, symptomValue: "Ruhedyspnoe: Akut aufgetretene, schwere Atembeschwerden oder das Gefühl, nicht genug Sauerstoff zu bekommen." },
                            { symptomName: "Stechender, atemabhängiger Brustschmerz", schmerzen: true, symptomValue: "Pleuritischer Schmerz: Schmerz verstärkt sich messerscharf beim tiefen Einatmen oder Husten." },
                            { symptomName: "Herzrasen, Herzstolpern oder Aussetzer", schmerzen: false, symptomValue: "Palpitationen: Spürbar unregelmäßiger, stolpernder oder extrem beschleunigter Herzschlag im Brustkorb." },
                            { symptomName: "Husten mit blutigem Schleim oder Auswurf", schmerzen: false, symptomValue: "Hämoptoe: Husten mit Beimengung von frischem Blut oder bräunlichem Auswurf." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- RÜCKEN OBEN / UNTEN --- */}
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
                 />
              )}
    
              {/* --- BECKEN & GENITALBEREICH KATEGORIEN --- */}
              {(step === "Genitalbereich" || step === "Becken") && (
                 <SymptomCategory
                          categories={[
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
                          ]}
                          setStep={setStep}
                          setInputMode={setInputMode}
                          selectedSubRegion={selectedSubRegion}
                 />
              )}

              {/* --- GEMEINSAME HARNWEGE --- */}
              {step === "genitalHarnwege" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Brennen oder Schmerzen beim Wasserlassen (Dysurie)", schmerzen: true, symptomValue: "Dysurie: Brennender, stechender Schmerz in der Harnröhre während oder direkt nach dem Urinieren." },
                            { symptomName: "Ständiger, starker Harndrang (Pollakisurie)", schmerzen: false, symptomValue: "Pollakisurie: Häufiges Aufsuchen der Toilette bei jeweils nur sehr geringen Urinmengen." },
                            { symptomName: "Erschwertes Wasserlassen / Abgeschwächter Harnstrahl", schmerzen: false, symptomValue: "Harnretention-Anfang: Das Wasserlassen beginnt verzögert, der Harnstrahl ist auffällig schwach oder unterbrochen." },
                            { symptomName: "Sichtbares Blut im Urin (Hämaturie)", schmerzen: false, symptomValue: "Makrohämaturie: Der Urin ist rötlich, fleischwasserfarben oder dunkelbraun verfärbt." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- WEIBLICHE GENITALSYMPTOME --- */}
              {step === "genitalSymptomeWeiblich" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Auffälliger Ausfluss (Farbe/Geruch verändert)", schmerzen: false, symptomValue: "Pathologischer Fluor: Vermehrter Ausfluss, der gelblich, grünlich oder krümelig-weiß ist, oder fischig/unangenehm riecht." },
                            { symptomName: "Starker Juckreiz oder Brennen im Intimbereich", schmerzen: false, symptomValue: "Vaginaler Juckreiz: Quälendes Jucken oder Brennen an den Schamlippen oder am Scheideneingang (z.B. Verdacht auf Pilzinfektion)." },
                            { symptomName: "Zwischenblutungen oder unregelmäßige Zyklen", schmerzen: false, symptomValue: "Metrorrhagie: Blutungen außerhalb der normalen Menstruation oder nach den Wechseljahren." },
                            { symptomName: "Starke Schmerzen bei der Menstruation (Dysmenorrhö)", schmerzen: true, symptomValue: "Dysmenorrhö: Krampfartige, stark einschränkende Unterleibsschmerzen während der Periode." },
                            { symptomName: "Schmerzen beim oder nach dem Geschlechtsverkehr", schmerzen: true, symptomValue: "Dyspareunie: Schmerzen im Bereich der Scheide oder tief im Unterleib bei sexueller Intimität." },
                            { symptomName: "Tastbare Knoten oder Schwellung der Schamlippen", schmerzen: false, symptomValue: "Schwellung im Intimbereich: Tastbare Verhärtungen oder schmerzhafte Schwellungen (z.B. Bartholini-Zyste)." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- MÄNNLICHE GENITALSYMPTOME --- */}
              {step === "genitalSymptomeMaennlich" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Schwellung oder Verhärtung des Hodens (schmerzlos)", schmerzen: false, symptomValue: "Hodenschwellung: Neu aufgetretene, schmerzlose Vergrößerung oder harter Knoten im Hoden (wichtiges Abklärungssignal!)." },
                            { symptomName: "Ziehender Schmerz im Hoden oder Leistenbereich", schmerzen: true, symptomValue: "Hodenbeschwerden: Dumpfer, ziehender Schmerz im Hoden, der sich beim Stehen oder Gehen verstärken kann." },
                            { symptomName: "Ausfluss aus der Harnröhre (Bonjour-Tropfen)", schmerzen: false, symptomValue: "Urethraler Ausfluss: Wässriger, schleimiger oder eitriger Ausfluss aus dem Penis außerhalb des Wasserlassens." },
                            { symptomName: "Schmerzen oder Druckgefühl zwischen Anus und Genital", schmerzen: true, symptomValue: "Prostatitis-Verdacht: Schmerzen im Dammbereich, oft ausstrahlend in den unteren Rücken oder Hoden." },
                            { symptomName: "Rötung, Juckreiz oder Belag auf Eichel/Vorhaut", schmerzen: false, symptomValue: "Balanitis: Entzündung der Eichel mit Juckreiz, Rötung oder weißen, trockenen Belägen." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- DIVERSE / ALLGEMEINE GENITALSYMPTOME --- */}
              {step === "genitalSymptomeDivers" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Starker Juckreiz, Brennen oder Rötung", schmerzen: false, symptomValue: "Pruritus/Entzündung: Quälendes Jucken oder brennendes Gefühl an den äußeren Genitalien oder Schleimhäuten." },
                            { symptomName: "Auffälliger Ausfluss (Menge, Farbe oder Geruch)", schmerzen: false, symptomValue: "Pathologischer Ausfluss: Ungewöhnliche Flüssigkeitsabgabe aus den Genitalien oder der Harnröhre." },
                            { symptomName: "Bläschen, offene Stellen oder Geschwüre", schmerzen: true, symptomValue: "Ulzera/Bläschen: Kleine, schmerzhafte Flüssigkeitsbläschen, Verkrustungen oder wunde Hautstellen im Intimbereich." },
                            { symptomName: "Schmerzen beim oder nach dem Geschlechtsverkehr", schmerzen: true, symptomValue: "Dyspareunie: Schmerzen im Genital- oder tiefen Beckenbereich während oder nach Intimität." },
                            { symptomName: "Tastbare Knoten, Schwellungen oder Raumforderungen", schmerzen: false, symptomValue: "Genitale Gewebeveränderung: Neu aufgetretene Knoten oder Schwellungen im Intimbereich." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- RED FLAGS / WARNSIGNALE --- */}
              {step === "genitalWarnsignale" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Plötzlicher, extremer Hodenschmerz (Notfall!)", schmerzen: true, symptomValue: "Hoden-Red-Flag: Akut einsetzender, unerträglicher Schmerz in einem Hoden (Verdacht auf Hodentorsion - sofortiger Notfall bei biologisch männlich)." },
                            { symptomName: "Vollständige Harnsperre (Unfähigkeit zu urinieren)", schmerzen: true, symptomValue: "Akuter Harnverhalt: Trotz extremer, schmerzhafter Drangbeschwerden kann kein Urin abgegeben werden (Akuter Notfall!)." },
                            { symptomName: "Schmerzhafte Dauererektion > 4 Std. (Priapismus)", schmerzen: true, symptomValue: "Priapismus: Schmerzhafte Erektion des Penises ohne sexuelle Stimulation (Gefahr von Gewebeschäden)." },
                            { symptomName: "Akuter, heftigster Unterleibsschmerz (akutes Abdomen)", schmerzen: true, symptomValue: "Unterbauch-Katastrophe: Plötzlich einschießende, messerscharfe Unterleibsschmerzen mit harter Bauchdecke, Kreislaufschwäche oder Fieber (z.B. Verdacht auf Eileiterschwangerschaft/Zystenruptur bei biologisch weiblich)." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- BEINE & FÜSSE KATEGORIEN --- */}
              {(step === "Oberschenkel" || step === "Knie" || step === "Unterschenkel" || step === "Fuß") && (
                 <SymptomCategory
                          categories={[
                            { category: "Gelenkschmerzen & Steifheit", step: "beineGelenke" },
                            { category: "Muskelbeschwerden & Krämpfe", step: "beineMuskeln" },
                            { category: "Nerven, Gefäße & Durchblutung", step: "beineNervenGefaese" },
                            { category: "Dringende Warnsignale (Beine)", step: "beineWarnsignale" }
                          ]}
                          setStep={setStep}
                          setInputMode={setInputMode}
                          selectedSubRegion={selectedSubRegion}
                 />
              )}

              {/* --- GELENKE (HÜFTE, KNIE, FUSSGELENK) --- */}
              {step === "beineGelenke" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Anlaufschmerz am Morgen / nach Pausen", schmerzen: true, symptomValue: "Anlaufschmerz: Gelenkschmerz (oft Knie oder Hüfte) bei den ersten Schritten nach Ruhephasen, der nach einigen Minuten Bewegung nachlässt (typisch für Arthrose)." },
                            { symptomName: "Belastungsabhängiger Gelenkschmerz", schmerzen: true, symptomValue: "Belastungsschmerz: Schmerzen, die erst bei längerer Gehstrecke, Sport oder beim Treppenabsteigen auftreten und in Ruhe wieder verschwinden." },
                            { symptomName: "Ruheschmerz / Nächtlicher Gelenkschmerz", schmerzen: true, symptomValue: "Gelenk-Ruheschmerz: Schmerzen im Gelenk auch ohne Belastung, besonders stark in der Nacht oder im Liegen (Hinweis auf Entzündung oder fortgeschrittenen Verschleiß)." },
                            { symptomName: "Überwärmtes, rotes und geschwollenes Gelenk", schmerzen: true, symptomValue: "Arthritis-Verdacht: Ein einzelnes Gelenk ist stark geschwollen, deutlich überwärmt, gerötet und extrem druckschmerzhaft (Verdacht auf Gichtanfall oder bakterielle Entzündung)." },
                            { symptomName: "Morgensteifigkeit der Gelenke (> 30 Min.)", schmerzen: false, symptomValue: "Morgensteifigkeit Bein: Die Gelenke fühlen sich nach dem Aufwachen für längere Zeit wie eingerostet und unbeweglich an." },
                            { symptomName: "Hörbares Knirschen oder Reiben im Gelenk", schmerzen: false, symptomValue: "Krepitation: Spürbares oder hörbares Reiben („Schneeballknirschen“) im Gelenk bei Bewegung." },
                            { symptomName: "Gefühl der Instabilität / Wegknicken des Knies", schmerzen: false, symptomValue: "Instabilitätsgefühl: Das Gefühl, das Gelenk hält nicht stand, oder das Knie knickt bei Belastung unwillkürlich weg (Verdacht auf Bänderriss / Meniskusschaden)." },
                            { symptomName: "Blockierung des Gelenks / Bewegungseinschränkung", schmerzen: true, symptomValue: "Gelenkblockade: Das Gelenk lässt sich plötzlich ab einem bestimmten Winkel nicht mehr weiter strecken oder beugen." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- MUSKELN & SEHNEN --- */}
              {step === "beineMuskeln" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Nächtliche Wadenkrämpfe", schmerzen: true, symptomValue: "Wadenkrampf: Plötzlich einschießende, schmerzhafte Muskelverhärtung der Wade, meistens im Schlaf." },
                            { symptomName: "Anhaltender Muskelkater / Diffuser Muskelschmerz", schmerzen: true, symptomValue: "Myalgie: Großflächiger, ziehender Druckschmerz in den Muskeln (z. B. nach Überlastung oder bei viralen Infekten)." },
                            { symptomName: "Punktueller, messerscharfer Schmerz nach Belastung", schmerzen: true, symptomValue: "Muskelfaserriss: Plötzlich einschießender, stechender Schmerz bei einer Bewegung, Gehen oder Laufen danach kaum noch möglich." },
                            { symptomName: "Schmerzen an der Achillessehne bei Druck/Belastung", schmerzen: true, symptomValue: "Achillodynie: Schmerzhafter, oft verdickter Bereich an der Sehne über der Ferse, besonders beim Abstoßen des Fußes." },
                            { symptomName: "Schienbeinkantenschmerz (Shin Splints)", schmerzen: true, symptomValue: "Periostitis: Belastungsschmerz an der Vorderseite des Unterschenkels entlang des Schienbeinknochens (häufig bei Läufern)." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- NERVEN & GEFÄSSE (DURCHBLUTUNG) --- */}
              {step === "beineNervenGefaese" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Krampfartige Wadenschmerzen beim Gehen (Gehpausen nötig)", schmerzen: true, symptomValue: "pAVK / Schaufensterkrankheit: Schmerzen in der Wade, die nach einer bestimmten Gehstrecke auftreten und zum Stehenbleiben zwingen; bessern sich rasch im Stehen." },
                            { symptomName: "Einschießen von Schmerzen vom Rücken ins Bein", schmerzen: true, symptomValue: "Ischialgie: Elektrisierender oder ziehender Schmerz, der vom Gesäß über die Rückseite des Beins bis in den Fuß ausstrahlt." },
                            { symptomName: "Kribbeln, Taubheitsgefühl oder „Ameisenlaufen“", schmerzen: false, symptomValue: "Parästhesien: Missempfindungen, pelziges Gefühl oder Taubheit (häufig an den Füßen oder Zehen, z. B. bei Polyneuropathie)." },
                            { symptomName: "Schwere, müde Beine und geschwollene Knöchel am Abend", schmerzen: false, symptomValue: "Venöse Insuffizienz: Spannungsgefühl und Schwellung der Beine, die sich im Laufe des Tages verschlimmern und bei Hochlagern besser werden." },
                            { symptomName: "Unruhige Beine am Abend / im Liegen (Bewegungsdrang)", schmerzen: false, symptomValue: "Restless-Legs-Syndrom: Quälender Unruhezustand oder Missempfindungen in den Beinen, die nur durch Aufstehen und Umhergehen kurzzeitig besser werden." },
                            { symptomName: "Chronisch kalte Füße oder bläuliche Verfärbung", schmerzen: false, symptomValue: "Durchblutungsstörung peripher: Füße sind dauerhaft kalt, schlecht durchblutet, Zehen verfärben sich bei Kälte blass oder bläulich." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- RED FLAGS / WARNSIGNALE --- */}
              {step === "beineWarnsignale" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Einseitig stark geschwollene, heiße, rote Wade (Notfall!)", schmerzen: true, symptomValue: "Thrombose-Red-Flag: Einseitige Umfangszunahme des Unterschenkels, die Haut glänzt, ist überwärmt, gerötet und schmerzt wie ein Muskelkater (Akuter Notfall!)." },
                            { symptomName: "Plötzlicher, unerträglicher Beinschmerz + Blässe + Kälte", schmerzen: true, symptomValue: "Akuter Arterienverschluss: Schlagartig einsetzender, heftigster Schmerz, der Fuß/das Bein wird eiskalt, blass und der Puls am Fuß ist nicht mehr tastbar (Sofortiger Notfall!)." },
                            { symptomName: "Lähmung / Fuß kann nicht mehr angehoben werden", schmerzen: false, symptomValue: "Peroneuslähmung / Fußheberparese: Plötzliche Unfähigkeit, die Fußspitze beim Gehen anzuheben (Schlurfender Gang / neurologisches Warnsignal)." },
                            { symptomName: "Schlecht heilende Wunden oder Geschwüre am Fuß", schmerzen: false, symptomValue: "Ulkus / Diabetischer Fuß: Offene, nicht abheilende Hautstellen, Gewebeveränderungen oder dunkle Flecken an den Zehen oder Fersen (besonders riskant bei Diabetes)." },
                            { symptomName: "Umknicktrauma mit sofortiger massiver Schwellung", schmerzen: true, symptomValue: "Schwere Distorsion / Fraktur: Nach einem Unfall oder Umknicken schwillt das Gelenk sofort massiv an, Auftreten oder Belastung ist völlig unmöglich." }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}

              {/* --- ALLGEMEINES BEFINDEN --- */}
              {step === "AllgemeinesBefinden" && (
                 <SymptomSelection
                          symptoms={[
                            { symptomName: "Schüttelfrost / Unkontrollierbares Zittern", schmerzen: false, symptomValue: "Schüttelfrost: Unkontrollierbares Zittern am ganzen Körper bei rasant steigendem Fieber." },
                            { symptomName: "Unerklärlicher, schneller Gewichtsverlust", schmerzen: false, symptomValue: "Gewichtsverlust: Ungewollte Gewichtsabnahme ohne Diät oder Ernährungsumstellung." },
                            { symptomName: "Anhaltende Nachtschweiße (Kleidungswechsel nötig)", schmerzen: false, symptomValue: "B-Symptomatik: Massives Schwitzen in der Nacht, sodass Schlafkleidung gewechselt werden muss." },
                            { symptomName: "Ausgeprägte, bleierne Müdigkeit und Abgeschlagenheit", schmerzen: false, symptomValue: "Fatigue/Schwäche: Extreme Antriebslosigkeit, die den Alltag massiv einschränkt." },
                            { symptomName: "Extreme Kältegefühle trotz warmem Raum", schmerzen: false, symptomValue: "Extreme Kältegefühle, obwohl es im Raum warm ist" },
                            { symptomName: "Diffuse Gliederschmerzen (wie bei echter Grippe)", schmerzen: true, symptomValue: "Diffuse Gliederschmerzen (die Muskeln, Gelenke und Knochen tun am ganzen Körper weh, wie bei einer echten Grippe)" },
                            { symptomName: "Tastbare, schmerzhafte Lymphknotenschwellung", schmerzen: true, symptomValue: "Deutlich tastbare, schmerzhafte oder geschwollene Knubbel am Hals, unter den Achseln oder in der Leiste (Lymphknoten)" },
                            { symptomName: "Verwirrtheit, Schläfrigkeit & Atembeschwerden", schmerzen: false, symptomValue: "Plötzliche, schwere Verwirrtheit, extreme Schläfrigkeit, Atemnot und sehr schneller Herzschlag bei einer Infektion" },
                            { symptomName: "Rote/lila Hautpunkte (nicht verblassend)", schmerzen: false, symptomValue: "Auftreten von kleinen, stecknadelkopfgroßen, roten oder lila Hautpunkten, die bei Druck (z. B. mit einem Glas) nicht verblassen" },
                            { symptomName: "Plötzliche, große blaue Flecken ohne Stoßen", schmerzen: false, symptomValue: "Plötzliches Auftreten von großen, blauen Flecken am Körper, ohne dass man sich gestoßen oder verletzt hat" }
                          ]}
                          inputMode={inputMode}
                          setStep={setStep}
                          toggleSymptom={toggleSymptom}
                          selectedSymptoms={selectedSymptoms}
                          selectedSubRegion={selectedSubRegion}
                          setCopyPainScale={setCopyPainScale}
                          copyPainScale={copyPainScale}
                          setSelectedSymptoms={setSelectedSymptoms}
                 />
              )}
    </>
  );
}