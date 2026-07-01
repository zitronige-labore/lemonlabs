// this file contains the symptoms to be selected
// these symptoms can be adjusted as needed

import { Step, SymptomSelectionList } from "@/app/types/assessment";

export function getSymptomList(gender?: string) {


    // list for symptom pages
    /* 
    pattern: 
    {step: "one of the category steps mentioned in symptomCategoryList.ts",
    symptoms:
        [
        { symptomName: "this text will show up on the button, must be easy to understand", schmerzen: this will define if a painscale pops up when selected, symptomValue: "the information passed to the backend, this should be as precise as possible",  snomedCode: "the fitting snomed code to the symptomValue text" },
        { symptomName: "nextSymptom easy description", schmerzen: true, symptomValue: "nextSymptom precise description", snomedCode: "next snomed code" },
        ]
    },
    */
    const symptomList: SymptomSelectionList =
        [
            {
                step: "psycheEnergie",
                symptoms:
                    [
                        { symptomName: "Anhaltende Erschöpfung (keine Verbesserung durch Schlaf)", schmerzen: false, symptomValue: "Anhaltende Erschöpfung: Gefühl von extremer Müdigkeit, die auch durch Schlaf nicht gebessert wird.", snomedCode: "84229001" },
                        { symptomName: "Antriebslosigkeit: Massive Überwindung nötig für einfachste Dinge", schmerzen: false, symptomValue: "Antriebslosigkeit: Massive Überwindung nötig, um einfachste Dinge zu tun.", snomedCode: "26413003" },
                        { symptomName: "Innere Erstarrung: emotionale Leere", schmerzen: false, symptomValue: "Innere Erstarrung: Gefühl, emotional leer, keine Gefühlsregungen mehr.", snomedCode: "6140007" },
                    ]
            },
            {
                step: "psycheStimmung",
                symptoms:
                    [
                        { symptomName: "Niedergeschlagenheit: Traurigkeit über langen Zeitraum", schmerzen: false, symptomValue: "Niedergeschlagenheit: Tiefes Gefühl von Traurigkeit oder Sinnlosigkeit über einen langen Zeitraum.", snomedCode: "87521009" },
                        { symptomName: "Interessenverlust", schmerzen: false, symptomValue: "Interessenverlust: Dinge, die früher wichtig waren, fühlen sich jetzt völlig gleichgültig an.", snomedCode: "28669007" },
                        { symptomName: "Starke Selbstzweifel", schmerzen: false, symptomValue: "Starke Selbstzweifel: Ständige Gedanken über eigene Fehler oder Minderwertigkeit.", snomedCode: "286649004" },
                        { symptomName: "Stimmungsschwankungen", schmerzen: false, symptomValue: "Stimmungsschwankungen: Häufige oder starke Wechsel der Stimmung innerhalb kurzer Zeit, ohne erkennbaren Auslöser, den Alltag beeinträchtigen.", snomedCode: "281129008" },

                    ]
            },
            {
                step: "psycheAngst",
                symptoms:
                    [
                        { symptomName: "Herzrasen", schmerzen: false, symptomValue: "Herzrasen: schneller Herzschlag und erhöhter Puls", snomedCode: "3424008" },
                        { symptomName: "Innere Unruhe", schmerzen: false, symptomValue: "Innere Unruhe: Ein Gefühl von ständiger Getriebenheit oder unter Strom stehen.", snomedCode: "424196004" },
                        { symptomName: "Gedankenkreisen", schmerzen: false, symptomValue: "Gedankenkreisen: Unfähigkeit, das Grübeln über Probleme oder Sorgen zu stoppen.", snomedCode: "86110000" },
                    ]
            },
            {
                step: "psycheWahrnehmung",
                symptoms:
                    [
                        { symptomName: "Konzentrationsmangel", schmerzen: false, symptomValue: "Konzentrationsmangel: Konzentrationsstörungen mit Schwierigkeiten, Gesprächen oder Tätigkeiten über längere Zeit zu folgen.", snomedCode: "26329005" },
                        { symptomName: "Veränderte/Verzerrte Wahrnehmung", schmerzen: false, symptomValue: "Veränderte Wahrnehmung: Gefühl, dass die Umwelt oder man selbst fremd oder unwirklich erscheint.", snomedCode: "1157237004" },
                    ]
            },
            {
                step: "psycheKrise",
                symptoms:
                    [
                        { symptomName: "Selbstverletzungsgedanken", schmerzen: false, symptomValue: "Selbstverletzungsgedanken: Der wiederkehrende Drang, sich selbst körperlichen Schmerz oder Schaden zuzufügen.", snomedCode: "102911000" },
                        { symptomName: "Suizidgedanken", schmerzen: false, symptomValue: "Suizidgedanken: Konkrete Pläne oder der Wunsch, das eigene Leben zu beenden.", snomedCode: "6471006" },
                        { symptomName: "Halluzinationen", schmerzen: false, symptomValue: "Halluzinationen: Hören von Stimmen oder Sehen von Dingen, die andere nicht wahrnehmen.", snomedCode: "7011001" },
                        { symptomName: "Akute Verwirrtheit", schmerzen: false, symptomValue: "Akute Verwirrtheit: Plötzliches Nicht-Wissen, wer man ist, welches Datum wir haben oder wo man sich befindet.", snomedCode: "130987000" },
                        { symptomName: "Fremdgefährdung", schmerzen: false, symptomValue: "Fremdgefährdung: Der Impuls oder das Vorhaben, anderen Menschen körperlich zu schaden.", snomedCode: "129707006" },

                    ]
            },
            {
                step: "aussenOhr",
                symptoms:
                    [
                        { symptomName: "Schmerz beim Drücken auf das Ohrläppchen vor dem Gehörgang", schmerzen: true, symptomValue: "Schmerz beim Drücken auf den kleinen Knorpel vor dem Gehörgang (Tragus)", snomedCode: "301385004" },
                        { symptomName: "Schmerz in der Ohrmuschel", schmerzen: true, symptomValue: "Schmerzen beim bewegen der Ohrmuschel", snomedCode: "792886009" },
                        { symptomName: "Juckendes Ohr", schmerzen: false, symptomValue: "Juckreiz im Gehörgang: Starkes Jucken", snomedCode: "699392007" },
                        { symptomName: "Ausfluss aus dem Ohr", schmerzen: false, symptomValue: "Ausfluss aus dem Ohr vorhanden", snomedCode: "162364004" },
                        { symptomName: "blutiger Ausfluss aus dem Ohr", schmerzen: false, symptomValue: "blutiges Sekret aus dem Ohr", snomedCode: "162365003" },
                        { symptomName: "Ohrenschwellung", schmerzen: false, symptomValue: "Gehörgangs-Schwellung: Ohr ist angeschwollen", snomedCode: "300874009" },
                        { symptomName: "Rötung der Ohrmuschel", schmerzen: true, symptomValue: "Rötung: Die Ohrmuschel ist rot", snomedCode: "247441003" },
                        { symptomName: "Blase an der Ohrmuschel", schmerzen: true, symptomValue: "Blasenbildung an der Ohrmuschel", snomedCode: "300097006" }
                    ]
            },
            {
                step: "innenOhr",
                symptoms:
                    [
                        { symptomName: "Bläschen im Gehörgang", schmerzen: true, symptomValue: "Bläschen im Gehörgang", snomedCode: "277171005" },
                        { symptomName: "Ohrenschmerzen", schmerzen: true, symptomValue: "Schmerzen im Ohr", snomedCode: "301354004" },
                        { symptomName: "Beidseitige Ohrenschmerzen", schmerzen: true, symptomValue: "Beidseitige Ohrenschmerzen", snomedCode: "162359003" },
                        { symptomName: "Ohrenschmerzen im linken Ohr", schmerzen: true, symptomValue: "Ohrenschmerzen im linken Ohr", snomedCode: "1010233001" },
                        { symptomName: "Ohrenschmerzen im rechten Ohr", schmerzen: true, symptomValue: "Ohrenschmerzen im rechten Ohr", snomedCode: "1010234007" },
                        { symptomName: "Stechender Schmerz", schmerzen: true, symptomValue: "Stechender Schmerz im Ohr", snomedCode: "55145008" },
                        { symptomName: "Gefühl von Wasser im Ohr", schmerzen: false, symptomValue: "Völlegefühl: Gefühl, als wäre Wasser im Ohr", snomedCode: "247372007" },
                        { symptomName: "Eigene Stimme hallt unangenehm laut", schmerzen: false, symptomValue: "Die eigene Stimme hallt unangenehm laut im Ohr wider", snomedCode: "247380004" },
                        { symptomName: "Knacken oder Klicken beim Schlucken/Gähnen", schmerzen: false, symptomValue: "Knacken/Klicken : Beim Schlucken oder Gähnen", snomedCode: "298132007" },
                        { symptomName: "Dumpfes Hören (wie unter Wasser)", schmerzen: false, symptomValue: "Dumpfes Hören: Wie „unter Wasser“", snomedCode: "6022007" },
                        { symptomName: "Ohrlaufen nach plötzlichem Schmerznachlass", schmerzen: false, symptomValue: "Ohrlaufen nach Schmerz: Plötzliches Nachlassen des Schmerzes verbunden mit Ausfluss", snomedCode: "302141004" },
                        { symptomName: "Tinnitus (Pfeifen, Brummen, Rauschen)", schmerzen: false, symptomValue: "Tinnitus: Pfeifen, Brummen, Rauschen, Zischen, Hämmern", snomedCode: "60862001" },
                        { symptomName: "Hörsturz (Plötzliche Taubheit)", schmerzen: false, symptomValue: "Hörsturz: Plötzliche, meist einseitige Taubheit ohne erkennbare Ursache", snomedCode: "59141008" },
                        { symptomName: "Ton wird auf Ohren unterschiedlich hoch gehört", schmerzen: false, symptomValue: "Ein Ton wird auf beiden Ohren unterschiedlich hoch wahrgenommen", snomedCode: "247385009" }
                    ]
            },
            {
                step: "Augen",
                symptoms: [
                    { symptomName: "Plötzlicher Sehverlust / Erblindung (einseitig)", schmerzen: false, symptomValue: "Sehverlust: Akute, schmerzlose Erblindung oder massive Sehverschlechterung auf einem Auge innerhalb von Sekunden/Minuten (Verdacht auf Gefäßverschluss).", snomedCode: "397540003" },
                    { symptomName: "Sehen von Doppelbildern ", schmerzen: false, symptomValue: "Doppelbilder: Gleichzeitiges Sehen von zwei Bildern eines einzelnen Objekts (wichtiges neurologisches Warnsignal).", snomedCode: "246534002" },
                    { symptomName: "Heftiger Augenschmerz mit Rötung und Sehfehlen", schmerzen: true, symptomValue: "Glaukom-Anfall: Extrem starker, akuter Augenschmerz, oft ausstrahlend in den Kopf, begleitet von einem geröteten, steinharten Auge und Sehverschlechterung (Sehen von Regenbogenhöfen).", snomedCode: "274134007" },
                    { symptomName: "Lichtblitze oder herabfallender Rußregen", schmerzen: false, symptomValue: "Netzhaut-Warnsignale: Wahrnehmung von plötzlichen Lichtblitzen (besonders bei Augenbewegung) oder massenhaft dunklen Punkten/Schleiern (Rußregen).", snomedCode: "698308003" },
                    { symptomName: "Zunehmender Schatten / Vorhang im Gesichtsfeld", schmerzen: false, symptomValue: "Gesichtsfeldausfall: Von oben, unten oder der Seite heranziehender dunkler Schatten oder Vorhang (Verdacht auf Netzhautablösung).", snomedCode: "399719002" },
                    { symptomName: "Starke Fremdkörper- oder Hornhautschmerzen", schmerzen: true, symptomValue: "Hornhautverletzung: Stechender, kontinuierlicher Schmerz, extremes Fremdkörpergefühl, starker Tränenfluss und krampfhaftes Schließen der Augenlider.", snomedCode: "247445007" },
                    { symptomName: "Eitriges Sekret und verklebte Lider", schmerzen: false, symptomValue: "Konjunktivitis (eitrig): Deutlich gelb-grünliches Sekret, besonders morgens stark verklebte Augenlider, gerötete Bindehaut.", snomedCode: "247167008" },
                    { symptomName: "Wässriges Sekret, Juckreiz und Brennen", schmerzen: false, symptomValue: "Konjunktivitis (allergisch/viral): Klares, wässriges Sekret, oft begleitet von starkem Juckreiz, Brennen und geschwollenen Lidrändern.", snomedCode: "247153008" },
                    { symptomName: "Extreme Lichtempfindlichkeit ", schmerzen: false, symptomValue: "Lichtempfindlichkeit: Schmerzhaftes oder unerträgliches Gefühl bei normalem Tages- oder Raumlicht, zwingt zum Zukneifen der Augen.", snomedCode: "246622003" },
                    { symptomName: "Verzerrtsehen / Wellige Linien", schmerzen: false, symptomValue: "Verzerrtsehen: Gerade Linien (z. B. Fliesenbaufugen, Textzeilen) erscheinen verbogen, wellig oder verzerrt (Hinweis auf Makulaerkrankung).", snomedCode: "1023001" }
                ]
            },
            {
                step: "Nase",
                symptoms:
                    [
                        { symptomName: "Starkes, unstillbares Nasenbluten", schmerzen: false, symptomValue: "Nasenbluten heftig: Ununterbrochener, starker Blutfluss (auch im Rachen spürbar), der sich durch normale Kompression (Nasenflügel zusammendrücken) nach 10-15 Minuten nicht stoppen lässt.", snomedCode: "64531003" },
                        { symptomName: "Eitriger Schnupfen und drückender Gesichtsschmerz", schmerzen: true, symptomValue: "Akute Sinusitis: Gelb-grünes, zähflüssiges Nasensekret gepaart mit drückendem oder klopfendem Schmerz über den Stirn- oder Kieferhöhlen, der sich beim Bücken oder Auftreten massiv verstärkt.", snomedCode: "247416002" },
                        { symptomName: "Völliger oder plötzlicher Verlust des Geruchssinns", schmerzen: false, symptomValue: "Anosmie: Akuter, vollständiger Verlust der Riechfähigkeit (und konsequent des Geschmackssinns) ohne oder mit Schnupfen.", snomedCode: "44169009" },
                        { symptomName: "Einseitige Verstopfung mit üblem Geruch", schmerzen: false, symptomValue: "Einseitige nasale Obstruktion: Nur ein Nasenloch ist chronisch verstopft, oft begleitet von eitrig-blutigem, auffällig faulig oder übel riechendem Sekret (Verdacht auf Fremdkörper oder Gewebeveränderung).", snomedCode: "697968004" },
                        { symptomName: "Wässriges Dauerrinnen + Niesreiz", schmerzen: false, symptomValue: "Rhinitis (allergisch): Ständiges Fließsymptom mit glasklarem, wässrigem Sekret, Attacken von Serien-Niesen, oft juckende oder brennende Nasenschleimhaut.", snomedCode: "232209000" },
                        { symptomName: "Austritt von glasklarer Flüssigkeit nach Kopfverletzung", schmerzen: false, symptomValue: "Rhinorrhö (Liquorverdacht): Unstillbares Laufen von spiegelklarer, wässriger Flüssigkeit aus der Nase nach einem Sturz oder Schlag auf den Kopf (Verdacht auf Schädelbasisbruch).", snomedCode: "284523000" },
                        { symptomName: "Trockene Schleimhäute mit schmerzhafter Borkenbildung", schmerzen: true, symptomValue: "Rhinitis sicca: Extrem trockenes Gefühl in der Nase, schmerzhafte Krusten- und Borkenbildung, die beim Lösen leicht blutet.", snomedCode: "232212006" }
                    ]
            },
            {
                step: "kopfSpannung", symptoms: [
                    { symptomName: "Dumpfer, drückender Schmerz (beidseitig)", schmerzen: true, symptomValue: "Dumpfer, drückender Schmerz auf beiden Seiten (wie ein zu enges Band um den Kopf)", snomedCode: "225140003" },
                    { symptomName: "Schmerz zieht vom Hinterkopf zur Stirn", schmerzen: true, symptomValue: "Schmerz zieht vom Hinterkopf hoch bis in die Stirn", snomedCode: "423027008" },
                    { symptomName: "Schwerer Druck auf dem gesamten Schädel", schmerzen: true, symptomValue: "Gefühl von schwerem Druck auf dem gesamten Schädel, ohne Pulsieren", snomedCode: "247348003" }
                ]
            },
            {
                step: "kopfMigraene",
                symptoms:
                    [
                        { symptomName: "Einseitiger, hämmernder/pulsierender Schmerz", schmerzen: true, symptomValue: "Einseitiger, hämmernder oder heftig pulsierender Schmerz", snomedCode: "274129007" },
                        { symptomName: "Schmerz wird bei Bewegung schlimmer", schmerzen: true, symptomValue: "Schmerz verschlimmert sich bei alltäglicher Bewegung (z. B. Treppensteigen, Bücken)", snomedCode: "247355006" }
                    ]
            },
            {
                step: "kopfCluster",
                symptoms:
                    [
                        { symptomName: "Extremer, bohrender Schmerz hinter einem Auge", schmerzen: true, symptomValue: "Extrem starker, unerträglicher, bohrender oder brennender Schmerz streng hinter einem Auge", snomedCode: "247345000" },
                        { symptomName: "Schmerzattacken nachts oder zur selben Uhrzeit", schmerzen: true, symptomValue: "Schmerz tritt in heftigen Attacken auf, meistens nachts oder zur gleichen Uhrzeit", snomedCode: "247351002" }
                    ]
            },
            {
                step: "kopfBegleitung",
                symptoms:
                    [
                        { symptomName: "Starke Übelkeit oder Drang zum Erbrechen", schmerzen: false, symptomValue: "Starke Übelkeit, flauer Magen oder Drang zum Erbrechen", snomedCode: "422587007" },
                        { symptomName: "Extreme Licht- oder Lärmempfindlichkeit", schmerzen: false, symptomValue: "Extreme Empfindlichkeit gegen normales Licht, Fernseher oder laute Geräusche", snomedCode: "162243003" },
                        { symptomName: "Sehen von Flimmern, Zacken oder Mustern ", schmerzen: false, symptomValue: "Sehen von Flimmern, Zacken, Mustern oder hellen Punkten (bevor der Schmerz anfängt)", snomedCode: "442685003" },
                        { symptomName: "Schwindel", schmerzen: false, symptomValue: "Schwindel: Unsicherheitsgefühl im Raum, Gefühl von Drehen, Schwanken oder drohender Ohnmacht.", snomedCode: "162058000" }
                    ]
            },
            {
                step: "kopfWarnsignale",
                symptoms:
                    [
                        { symptomName: "Explosionsartiger Vernichtungsschmerz", schmerzen: true, symptomValue: "Explosionsartiger Schmerz von einer Sekunde auf die andere (so schlimm wie noch nie)", snomedCode: "447432005" },
                        { symptomName: "Kopfschmerz mit Fieber und steifem Nacken", schmerzen: true, symptomValue: "Kopfschmerz kombiniert mit Fieber, Schüttelfrost und steifem Nacken", snomedCode: "162159002" },
                        { symptomName: "Kopfschmerz mit Lähmung oder Sprachstörung", schmerzen: true, symptomValue: "Gleichzeitige Lähmungen im Gesicht/Arm, Sprachstörungen, Sehstörungen oder Verwirrtheit", snomedCode: "423232007" }
                    ]
            },
            {
                step: "nackenBewegung",
                symptoms:
                    [
                        { symptomName: "Schmerzhafte Muskelverhärtung", schmerzen: true, symptomValue: "Nackensteife muskulär: Deutlich tastbare, harte und schmerzhafte Knubbel oder Stränge in der Nacken- und Schultermuskulatur.", snomedCode: "241988008" },
                        { symptomName: "Eingeschränkte Drehung / Steifer Hals", schmerzen: true, symptomValue: "Bewegungseinschränkung: Der Kopf lässt sich nur unter starken Schmerzen oder blockiert zu einer Seite drehen oder neigen.", snomedCode: "249822005" },
                        { symptomName: "Knirschen bei Kopfbewegungen", schmerzen: false, symptomValue: "HWS-Krepitation: Hörbares oder spürbares Reiben und Knacken in der Halswirbelsäule beim Kreisen des Kopfes.", snomedCode: "289452003" },
                        { symptomName: "Ziehender Schmerz strahlt in den Hinterkopf", schmerzen: true, symptomValue: "Zervikalgie: Schmerzen im Nacken, die bandförmig nach oben in den Hinterkopf ziehen und dort Kopfschmerzen auslösen.", snomedCode: "302914008" }
                    ]
            },
            {
                step: "nackenWarnsignale",
                symptoms:
                    [
                        { symptomName: "Nackensteife: Kopf kann nicht auf die Brust gelegt werden", schmerzen: true, symptomValue: "Meningismus (Red Flag): Extreme, schmerzhafte Blockade beim Versuch, das Kinn passiv auf die Brust zu legen, oft mit Fieber oder Lichtempfindlichkeit (Verdacht auf Hirnhautentzündung).", snomedCode: "72175007" },
                        { symptomName: "Schmerz strahlt elektrisierend in den Arm aus", schmerzen: true, symptomValue: "Wurzelkompression HWS: Messerscharfer oder elektrisierender Schmerz, der über die Schulter bis in die Finger zieht, evtl. mit Taubheitsgefühl (Bandscheibenvorfall HWS).", snomedCode: "230185006" },
                        { symptomName: "Schwindel oder Sehstörungen bei Kopfdrehung", schmerzen: false, symptomValue: "Zervikaler Schwindel: Auftreten von Drehschwindel, Gangunsicherheit oder flimmernden Augen direkt bei schnellen Kopfbewegungen.", snomedCode: "247661001" },
                        { symptomName: "Nackenschmerz nach Sturz oder Unfall (Peitschenhieb)", schmerzen: true, symptomValue: "HWS-Trauma: Akut einsetzende Schmerzen nach einem Auffahrunfall, Sturz oder heftigem Ruck (Verdacht auf Schleudertrauma/Fraktur).", snomedCode: "91613004" }
                    ]
            },
            {
                step: "mundZaehneSchmerz",
                symptoms:
                    [
                        { symptomName: "Pulsierender, klopfender Zahnschmerz", schmerzen: true, symptomValue: "Pulpitis-Verdacht: Anhaltender, heftiger und rhythmisch klopfender Schmerz im Zahn, der sich im Liegen oder bei Wärme massiv verstärkt.", snomedCode: "274131007" },
                        { symptomName: "Empfindlichkeit bei Kälte, Wärme oder Süßem", schmerzen: true, symptomValue: "Überempfindliche Zahnhälse: Kurz einschießender, stechender Schmerz bei Kontakt mit kalten, heißen oder süßen Speisen/Getränken.", snomedCode: "424422003" },
                        { symptomName: "Aufbissschmerz / Schmerz beim Kauen", schmerzen: true, symptomValue: "Parodontitis/Wurzelspitze: Der Zahn schmerzt intensiv, sobald Druck von oben auf ihn ausgeübt wird oder beim Zusammenbeißen.", snomedCode: "249480005" },
                        { symptomName: "Nächtliches Zähneknirschen / Kieferschmerzen am Morgen", schmerzen: true, symptomValue: "Bruxismus/CMD: Dumpfer Druckschmerz im Kiefergelenk und den Schläfen direkt nach dem Aufwachen, oft mit Verspannungen.", snomedCode: "65074003" },
                        { symptomName: "Schmerzhafte Schwellung der Wange (Dicke Backe)", schmerzen: true, symptomValue: "Abszess (Red Flag): Rasch zunehmende, heiße Schwellung im Gesicht oder am Kiefer, teils mit Fieber oder Schluckbeschwerden (Sofortiger Behandlungsbedarf).", snomedCode: "363168001" }
                    ]
            },
            {
                step: "mundZaehneSchleimhaut",
                symptoms:
                    [
                        { symptomName: "Zahnfleischbluten beim Zähneputzen", schmerzen: false, symptomValue: "Gingivitis: Leicht auslösbare Blutungen am Zahnfleischrand, oft begleitet von Rötung und Schwellung.", snomedCode: "442497006" },
                        { symptomName: "Schmerzhafte, kleine Bläschen/Geschwüre", schmerzen: true, symptomValue: "Aphten: Kleine, rundliche, weiß-gelblich belegte Schleimhautdefekte mit rotem Rand, die beim Essen und Sprechen stark brennen.", snomedCode: "110321004" },
                        { symptomName: "Weißer, abwischbarer Belag", schmerzen: false, symptomValue: "Candidose: Trockenes Gefühl im Mund gepaart mit stippchenartigen, weißen Belägen auf der Zunge oder Wangeninnenseite, die sich abwischen lassen.", snomedCode: "5154007" },
                        { symptomName: "Anhaltende Mundtrockenheit", schmerzen: false, symptomValue: "Mundtrockenheit: Zu geringer Speichelfluss, brennendes Gefühl auf der Zunge, Erschwerung beim Schlucken trockener Nahrung.", snomedCode: "87715008" },
                        { symptomName: "Chronisch gerötete, brennende Zunge", schmerzen: true, symptomValue: "Zungenbrennen: Missempfindungen oder brennender Schmerz auf der Zungenoberfläche ohne sichtbare Verletzung (z.B. bei Vitaminmangel).", snomedCode: "1230003" }
                    ]
            },
            {
                step: "mdSpeiseroehre",
                symptoms:
                    [
                        { symptomName: "Sodbrennen (Brennen hinter Brustbein)", schmerzen: true, symptomValue: "Sodbrennen: Brennendes Gefühl hinter dem Brustbein, oft nach dem Essen oder im Liegen.", snomedCode: "16331000" },
                        { symptomName: "Saures Aufstoßen von Magensaft", schmerzen: false, symptomValue: "Saures Aufstoßen: Rückfluss von Magensaft oder Speiseresten bis in den Mundraum.", snomedCode: "51351003" },
                        { symptomName: "Schluckstörung (Nahrung bleibt stecken)", schmerzen: true, symptomValue: "Schluckstörung: Das Gefühl, dass Nahrung im Hals oder in der Brust „stecken bleibt“.", snomedCode: "40739000" },
                        { symptomName: "Kloßgefühl im Hals", schmerzen: false, symptomValue: "Kloßgefühl: Ein ständiges Druck- oder Fremdkörpergefühl im Halsbereich.", snomedCode: "247144005" },
                        { symptomName: "Schmerz direkt beim Schluckvorgang", schmerzen: true, symptomValue: "Schmerz beim Schlucken: Stechender Schmerz direkt beim Schluckvorgang.", snomedCode: "41311003" }
                    ]
            },
            {
                step: "mdMagen",
                symptoms:
                    [
                        { symptomName: "Magendruck unter dem Brustbein", schmerzen: true, symptomValue: "Magendruck: Unangenehmer Druck oder Schmerz direkt unter dem Brustbein (Oberbauch).", snomedCode: "247341009" },
                        { symptomName: "Völlegefühl nach kleinsten Portionen", schmerzen: false, symptomValue: "Völlegefühl: Gefühl, bereits nach sehr kleinen Portionen „pappsatt“ zu sein.", snomedCode: "249481009" },
                        { symptomName: "Nüchternschmerz (besser nach dem Essen)", schmerzen: true, symptomValue: "Nüchternschmerz: Magenschmerzen bei leerem Magen, die nach dem Essen oft besser werden.", snomedCode: "424754006" },
                        { symptomName: "Übelkeit & Erbrechen von Mageninhalt", schmerzen: false, symptomValue: "Übelkeit & Erbrechen: Flaues Gefühl im Magen bis hin zum Erbrechen von Mageninhalt.", snomedCode: "249497008" },
                        { symptomName: "Kaffeesatz-Erbrechen (Dunkel & krümelig)", schmerzen: true, symptomValue: "Kaffeesatz-Erbrechen: Dunkles, krümeliges Erbrochenes (Sofortiger Notfall!).", snomedCode: "421115003" }
                    ]
            },
            {
                step: "mdGalle",
                symptoms:
                    [
                        { symptomName: "Gelbverfärbung der Haut / Augenweiß", schmerzen: false, symptomValue: "Gelbsucht: Gelbverfärbung des Augenweiß oder der Haut.", snomedCode: "18165001" },
                        { symptomName: "Gallenkolik (Krämpfe im rechten Oberbauch)", schmerzen: true, symptomValue: "Gallenkolik: Heftige, krampfartige Schmerzen im rechten Oberbauch.", snomedCode: "71400005" },
                        { symptomName: "Auffällig dunkler Urin (Cola-Farbe)", schmerzen: false, symptomValue: "Dunkler Urin: Urin ist auffällig dunkel (wie Cola oder dunkles Bier).", snomedCode: "274155006" },
                        { symptomName: "Sandfarbener, fast weißer Stuhlgang", schmerzen: false, symptomValue: "Heller Stuhl: Der Stuhlgang ist sandfarben oder fast weiß entfärbt.", snomedCode: "247171003" }
                    ]
            },
            {
                step: "mdDarm",
                symptoms:
                    [
                        { symptomName: "Plötzliche, wellenartige Bauchkrämpfe", schmerzen: true, symptomValue: "Bauchkrämpfe: Plötzlich einschießende, wellenartige Schmerzen im ganzen Bauch.", snomedCode: "43724002" },
                        { symptomName: "Praller, harter Blähbauch (zu viel Luft)", schmerzen: true, symptomValue: "Blähbauch: Der Bauch ist prall, hart und schmerzhaft durch zu viel Luft.", snomedCode: "116289008" },
                        { symptomName: "Durchfall (öfter als 3-mal am Tag)", schmerzen: false, symptomValue: "Durchfall: Wässriger oder sehr weicher Stuhl (öfter als 3-mal am Tag).", snomedCode: "62315008" },
                        { symptomName: "Verstopfung / Sehr harter Stuhlgang", schmerzen: true, symptomValue: "Verstopfung: Seltener Stuhlgang (weniger als 3-mal pro Woche) oder sehr harter Stuhl.", snomedCode: "14760008" },
                        { symptomName: "Fettstuhl (glänzend, schwimmt oben)", schmerzen: false, symptomValue: "Fettstuhl: Glänzender, klebriger Stuhl, der in der Toilette oben schwimmt.", snomedCode: "66126008" }
                    ]
            },
            {
                step: "mdEnddarm",
                symptoms:
                    [
                        { symptomName: "Teerstuhl (Tiefschwarz & glänzend)", schmerzen: false, symptomValue: "Teerstuhl: Tiefschwarzer, glänzender und klebriger Stuhl (Inneres Bluten!).", snomedCode: "29010006" },
                        { symptomName: "Frisches, hellrotes Blut auf dem Stuhl", schmerzen: false, symptomValue: "Frisches Blut: Hellrote Blutspuren auf dem Stuhl oder am Toilettenpapier.", snomedCode: "25114009" },
                        { symptomName: "Bleistiftstuhl (Auffällig dünner Stuhl)", schmerzen: false, symptomValue: "Bleistiftstuhl: Auffällig dünn geformter Stuhl.", snomedCode: "247180004" }
                    ]
            },
            {
                step: "Schulter",
                symptoms:
                    [
                        { symptomName: "Stechender Schmerz beim seitlichen Anheben", schmerzen: true, symptomValue: "Impingement-Syndrom: Stechender Schmerz beim seitlichen Anheben des Arms (zwischen 60° und 120°).", snomedCode: "289061007" },
                        { symptomName: "Starkes Schulterpochen nachts (Liegen unmöglich)", schmerzen: true, symptomValue: "Nachtschmerz: Starkes Pochen in der Schulter; Liegen auf der betroffenen Seite ist unmöglich.", snomedCode: "247351002" },
                        { symptomName: "Knirschen/Reibegeräusche im Schultergelenk", schmerzen: false, symptomValue: "Knirschen (Krepitation): Hörbare oder spürbare Reibegeräusche im Gelenk bei kreisenden Bewegungen.", snomedCode: "289452003" },
                        { symptomName: "Plötzlicher Knall mit Muskelvorwölbung", schmerzen: true, symptomValue: "Bizepssehnen-Ruptur: Plötzlicher Knall mit anschließender Vorwölbung des Muskelbauchs (Popeye-Syndrom).", snomedCode: "281630009" },
                        { symptomName: "Punktueller, messerscharfer Schmerz bei Bewegung", schmerzen: true, symptomValue: "Muskelkater vs. Riss: Diffuser Druckschmerz nach Sport vs. punktueller, messerscharfer Schmerz bei Bewegung.", snomedCode: "297120005" },
                        { symptomName: "Brennen, Kribbeln oder Ameisenlaufen", schmerzen: false, symptomValue: "Parästhesien: Brennen, Kribbeln oder Ameisenlaufen ohne äußeren Reiz.", snomedCode: "43214002" },
                        { symptomName: "Normale Berührung wird als schmerzhaft empfunden", schmerzen: true, symptomValue: "Dysästhesie: Missempfindung: Normale Berührung wird als unangenehm oder schmerzhaft empfunden.", snomedCode: "225184000" },
                        { symptomName: "Verlust der Trennung von zwei Berührungspunkten", schmerzen: false, symptomValue: "Diskriminierung: Verlust der Fähigkeit, zwei Berührungspunkte getrennt wahrzunehmen.", snomedCode: "249955000" },
                        { symptomName: "Unerträglicher Schmerz, Haut blass & kalt", schmerzen: true, symptomValue: "Ischämieschmerz: Unerträglicher Schmerz bei blasser, kalter Haut (Gefäßverschluss - Notfall!).", snomedCode: "274138005" }
                    ]
            },
            {
                step: "Oberarm",
                symptoms:
                    [
                        { symptomName: "Stechender Schmerz beim seitlichen Anheben", schmerzen: true, symptomValue: "Impingement-Syndrom: Stechender Schmerz beim seitlichen Anheben des Arms (zwischen 60° und 120°).", snomedCode: "289061007" },
                        { symptomName: "Starkes Schulterpochen nachts (Liegen unmöglich)", schmerzen: true, symptomValue: "Nachtschmerz: Starkes Pochen in der Schulter; Liegen auf der betroffenen Seite ist unmöglich.", snomedCode: "247351002" },
                        { symptomName: "Plötzlicher Knall mit Muskelvorwölbung", schmerzen: true, symptomValue: "Bizepssehnen-Ruptur: Plötzlicher Knall mit anschließender Vorwölbung des Muskelbauchs (Popeye-Syndrom).", snomedCode: "281630009" },
                        { symptomName: "Punktueller, messerscharfer Schmerz bei Bewegung", schmerzen: true, symptomValue: "Muskelkater vs. Riss: Diffuser Druckschmerz nach Sport vs. punktueller, messerscharfer Schmerz bei Bewegung.", snomedCode: "297120005" },
                        { symptomName: "Brennen, Kribbeln oder Ameisenlaufen", schmerzen: false, symptomValue: "Parästhesien: Brennen, Kribbeln oder Ameisenlaufen ohne äußeren Reiz.", snomedCode: "43214002" },
                        { symptomName: "Normale Berührung wird als schmerzhaft empfunden", schmerzen: true, symptomValue: "Dysästhesie: Missempfindung: Normale Berührung wird als unangenehm oder schmerzhaft empfunden.", snomedCode: "225184000" },
                        { symptomName: "Verlust der Trennung von zwei Berührungspunkten", schmerzen: false, symptomValue: "Diskriminierung: Verlust der Fähigkeit, zwei Berührungspunkte getrennt wahrzunehmen.", snomedCode: "249955000" },
                        { symptomName: "Unerträglicher Schmerz, Haut blass & kalt", schmerzen: true, symptomValue: "Ischämieschmerz: Unerträglicher Schmerz bei blasser, kalter Haut (Gefäßverschluss - Notfall!).", snomedCode: "274138005" }
                    ]
            },
            {
                step: "Hand",
                symptoms:
                    [
                        { symptomName: "Elektrisierende Schläge bis in den Ringfinger", schmerzen: true, symptomValue: "Sulcus-Ulnaris-Syndrom: Elektrisierende Schläge bis in den Ringfinger bei Druck auf die Ellbogen-Innenseite.", snomedCode: "230190008" },
                        { symptomName: "Schmerz beim kräftigen Ausdrehen der Hand", schmerzen: true, symptomValue: "Suppinationsschmerz: Schmerz beim kräftigen Ausdrehen der Hand (z. B. Schraubbewegung).", snomedCode: "443370002" },
                        { symptomName: "Einschlafen der Hand nachts (Daumen/Mittelfinger)", schmerzen: false, symptomValue: "Karpaltunnelsyndrom: Einschlafen der Hand nachts (Daumen bis Mittelfinger), Schmerzlinderung durch Schütteln.", snomedCode: "51599000" },
                        { symptomName: "Sichtbares Loch / flacher Daumenballen", schmerzen: false, symptomValue: "Karpaltunnel-Atrophie: Sichtbares Loch oder flacher Daumenballen durch langjährigen Nervendruck.", snomedCode: "249911005" },
                        { symptomName: "Unfähigkeit die Hand nach oben zu strecken", schmerzen: false, symptomValue: "Fallhand: Unfähigkeit, die Hand im Handgelenk nach oben zu strecken (Radialis-Lähmung).", snomedCode: "302029007" },
                        { symptomName: "Tastbare Knoten in Innenhand (Strecken unmöglich)", schmerzen: false, symptomValue: "Dupuytren-Kontraktur: Tastbare Knoten oder Stränge in der Innenhand; Finger lassen sich nicht mehr flach auflegen.", snomedCode: "414165007" },
                        { symptomName: "Finger bleibt in Beugung hängen und schnappt", schmerzen: true, symptomValue: "Trigger-Finger: Finger bleibt in Beugung hängen und schnappt erst bei Kraftaufwand auf.", snomedCode: "59382006" },
                        { symptomName: "Härte, knöcherne Verdickungen an Fingergelenken", schmerzen: true, symptomValue: "Arthrose-Knoten: Harte, knöcherne Verdickungen an den Fingergelenken (Heberden- & Bouchard-Knoten).", snomedCode: "111531001" },
                        { symptomName: "Brennen, Kribbeln oder Ameisenlaufen", schmerzen: false, symptomValue: "Parästhesien: Brennen, Kribbeln oder Ameisenlaufen ohne äußeren Reiz.", snomedCode: "43214002" },
                        { symptomName: "Normale Berührung wird als schmerzhaft empfunden", schmerzen: true, symptomValue: "Dysästhesie: Missempfindung: Normale Berührung wird als unangenehm oder schmerzhaft empfunden.", snomedCode: "225184000" },
                        { symptomName: "Verlust der Trennung von zwei Berührungspunkten", schmerzen: false, symptomValue: "Diskriminierung: Verlust der Fähigkeit, zwei Berührungspunkte getrennt wahrzunehmen.", snomedCode: "249955000" },
                        { symptomName: "Fingernagel braucht > 2 Sek. um rosa zu werden", schmerzen: false, symptomValue: "Kapillarfüllzeit: Nach Druck auf den Nagel dauert es länger als 2 Sek., bis er wieder rosa wird.", snomedCode: "274094002" },
                        { symptomName: "Unerträglicher Schmerz, Haut blass & kalt", schmerzen: true, symptomValue: "Ischämieschmerz: Unerträglicher Schmerz bei blasser, kalter Haut (Gefäßverschluss - Notfall!).", snomedCode: "274138005" }
                    ]
            },
            {
                step: "Unterarm",
                symptoms:
                    [
                        { symptomName: "Elektrisierende Schläge bis in den Ringfinger", schmerzen: true, symptomValue: "Sulcus-Ulnaris-Syndrom: Elektrisierende Schläge bis in den Ringfinger bei Druck auf die Ellbogen-Innenseite.", snomedCode: "230190008" },
                        { symptomName: "Rote, heiße Schwellung auf der Ellbogenspitze", schmerzen: true, symptomValue: "Bursitis (Schleimbeutel): Prall-elastische, oft rote und heiße Schwellung direkt auf der Ellbogenspitze.", snomedCode: "302302001" },
                        { symptomName: "Einschlafen der Hand nachts (Daumen/Mittelfinger)", schmerzen: false, symptomValue: "Karpaltunnelsyndrom: Einschlafen der Hand nachts (Daumen bis Mittelfinger), Schmerzlinderung durch Schütteln.", snomedCode: "51599000" },
                        { symptomName: "Sichtbares Loch / flacher Daumenballen", schmerzen: false, symptomValue: "Karpaltunnel-Atrophie: Sichtbares Loch oder flacher Daumenballen durch langjährigen Nervendruck.", snomedCode: "249911005" },
                        { symptomName: "Unfähigkeit die Hand nach oben zu strecken", schmerzen: false, symptomValue: "Fallhand: Unfähigkeit, die Hand im Handgelenk nach oben zu strecken (Radialis-Lähmung).", snomedCode: "302029007" },
                        { symptomName: "Härte, knöcherne Verdickungen an Fingergelenken", schmerzen: true, symptomValue: "Arthrose-Knoten: Harte, knöcherne Verdickungen an den Fingergelenken (Heberden- & Bouchard-Knoten).", snomedCode: "111531001" },
                        { symptomName: "Brennen, Kribbeln oder Ameisenlaufen", schmerzen: false, symptomValue: "Parästhesien: Brennen, Kribbeln oder Ameisenlaufen ohne äußeren Reiz.", snomedCode: "43214002" },
                        { symptomName: "Normale Berührung wird als schmerzhaft empfunden", schmerzen: true, symptomValue: "Dysästhesie: Missempfindung: Normale Berührung wird als unangenehm oder schmerzhaft empfunden.", snomedCode: "225184000" },
                        { symptomName: "Verlust der Trennung von zwei Berührungspunkten", schmerzen: false, symptomValue: "Diskriminierung: Verlust der Fähigkeit, zwei Berührungspunkte getrennt wahrzunehmen.", snomedCode: "249955000" },
                        { symptomName: "Unerträglicher Schmerz, Haut blass & kalt", schmerzen: true, symptomValue: "Ischämieschmerz: Unerträglicher Schmerz bei blasser, kalter Haut (Gefäßverschluss - Notfall!).", snomedCode: "274138005" }
                    ]
            },
            {
                step: "halsMandeln",
                symptoms:
                    [
                        { symptomName: "Kloßige Sprache ", schmerzen: false, symptomValue: "Kloßige Sprache: „Klingt, als hätte man eine heiße Kartoffel im Mund", snomedCode: "286369004" },
                        { symptomName: "Kiefersperre (Mund geht nicht weit auf)", schmerzen: true, symptomValue: "Kiefersperre (Mund lässt sich nicht weit öffnen)", snomedCode: "27110006" },
                        { symptomName: "Extremer, auffälliger Mundgeruch", schmerzen: false, symptomValue: "Extremer Mundgeruch", snomedCode: "232402005" },
                        { symptomName: "Eine Mandel drückt das Gaumensegel zur Seite", schmerzen: true, symptomValue: "Einseitige Vorwölbung: Eine Mandel drückt das Gaumensegel zur Seite", snomedCode: "247150005" }
                    ]
            },
            {
                step: "halsRachen",
                symptoms:
                    [
                        { symptomName: "Kloß im Hals ohne echtes Hindernis", schmerzen: false, symptomValue: "Globusgefühl: „Kloß im Hals“ ohne echtes Hindernis beim Schlucken", snomedCode: "247144005" },
                        { symptomName: "Gefühl Schleim laufe den Rachen runter", schmerzen: false, symptomValue: "Ständiges Gefühl, Schleim laufe von oben den Rachen runter", snomedCode: "59374003" },
                        { symptomName: "Räusperzwang (Ständiger Drang frei zu machen)", schmerzen: false, symptomValue: "Räusperzwang: Ständiger Drang, den Hals freizumachen", snomedCode: "40300007" },
                        { symptomName: "Trockenes Kratzen im Hals (morgens)", schmerzen: false, symptomValue: "Trockenes Kratzen: Besonders morgens nach dem Aufstehen", snomedCode: "247142009" }
                    ]
            },
            {
                step: "halsKehlkopf",
                symptoms:
                    [
                        { symptomName: "Heiserkeit / Wegbrechen der Stimme", schmerzen: false, symptomValue: "Heiserkeit: Rauigkeit, behauchte Stimme, Wegbrechen der Stimme", snomedCode: "50207005" },
                        { symptomName: "Kompletter Stimmenverlust (nur noch Flüstern)", schmerzen: false, symptomValue: "Kompletter Stimmenverlust (man kann nur noch flüstern)", snomedCode: "44445001" },
                        { symptomName: "Pfeifendes Geräusch beim Einatmen ", schmerzen: false, symptomValue: "Inspirations-Stridor: Pfeifendes Geräusch beim Einatmen (Engstelle oben)", snomedCode: "70407001" },
                        { symptomName: "Pfeifendes Geräusch beim Ausatmen", schmerzen: false, symptomValue: "Exspirations-Stridor: Pfeifendes Geräusch beim Ausatmen (Engstelle tiefer)", snomedCode: "248568003" },
                        { symptomName: "Bellender, trockener, metallischer Husten", schmerzen: false, symptomValue: "Bellender Husten: Hart, trocken, metallisch klingend", snomedCode: "266304000" },
                        { symptomName: "Stechender Schmerz beim Sprechen strahlt zum Ohr", schmerzen: true, symptomValue: "Stechender Schmerz beim Sprechen: Schmerz strahlt oft zum Ohr aus", snomedCode: "247141002" }
                    ]
            },
            {
                step: "halsDruesen",
                symptoms:
                    [
                        { symptomName: "Lymphknoten druckschmerzhaft", schmerzen: true, symptomValue: "Druckschmerzhaft: Meist Zeichen einer Entzündung.", snomedCode: "162137007" },
                        { symptomName: "Lymphknoten schmerzlos & hart", schmerzen: false, symptomValue: "Schmerzlos & Hart: Warnsignal (muss abgeklärt werden)", snomedCode: "247124009" },
                        { symptomName: "Lymphknoten unter der Haut verschieblich", schmerzen: false, symptomValue: "Verschieblich: „Kugel“ lässt sich unter der Haut bewegen", snomedCode: "274104001" },
                        { symptomName: "Lymphknoten fest mit Untergrund verbacken", schmerzen: false, symptomValue: "Verbacken: Gewebe fühlt sich fest mit dem Untergrund verbunden an", snomedCode: "274105000" }
                    ]
            },
            {
                step: "Brust links",
                symptoms:
                    [
                        { symptomName: "Engegefühl, massiver Druck oder Brennen", schmerzen: true, symptomValue: "Akuter Brustschmerz: Dumpfer, drückender oder brennender Schmerz („Elefant auf der Brust“), evtl. Ausstrahlung in Arm/Kiefer (Sofortiger Notfall!).", snomedCode: "29857009" },
                        { symptomName: "Atemnot / Luftnot schon im Ruhezustand", schmerzen: false, symptomValue: "Ruhedyspnoe: Akut aufgetretene, schwere Atembeschwerden oder das Gefühl, nicht genug Sauerstoff zu bekommen.", snomedCode: "271825005" },
                        { symptomName: "Stechender, atemabhängiger Brustschmerz", schmerzen: true, symptomValue: "Pleuritischer Schmerz: Schmerz verstärkt sich messerscharf beim tiefen Einatmen oder Husten.", snomedCode: "274135008" },
                        { symptomName: "Herzrasen, Herzstolpern oder Aussetzer", schmerzen: false, symptomValue: "Palpitationen: Spürbar unregelmäßiger, stolpernder oder extrem beschleunigter Herzschlag im Brustkorb.", snomedCode: "80313002" },
                        { symptomName: "Husten mit blutigem Schleim oder Auswurf", schmerzen: false, symptomValue: "Hämoptoe: Husten mit Beimengung von frischem Blut oder bräunlichem Auswurf.", snomedCode: "66857006" }
                    ]
            },
            {
                step: "Brust rechts",
                symptoms:
                    [
                        { symptomName: "Engegefühl, massiver Druck oder Brennen", schmerzen: true, symptomValue: "Akuter Brustschmerz: Dumpfer, drückender oder brennender Schmerz („Elefant auf der Brust“), evtl. Ausstrahlung in Arm/Kiefer (Sofortiger Notfall!).", snomedCode: "29857009" },
                        { symptomName: "Atemnot / Luftnot schon im Ruhezustand", schmerzen: false, symptomValue: "Ruhedyspnoe: Akut aufgetretene, schwere Atembeschwerden oder das Gefühl, nicht genug Sauerstoff zu bekommen.", snomedCode: "271825005" },
                        { symptomName: "Stechender, atemabhängiger Brustschmerz", schmerzen: true, symptomValue: "Pleuritischer Schmerz: Schmerz verstärkt sich messerscharf beim tiefen Einatmen oder Husten.", snomedCode: "274135008" },
                        { symptomName: "Herzrasen, Herzstolpern oder Aussetzer", schmerzen: false, symptomValue: "Palpitationen: Spürbar unregelmäßiger, stolpernder oder extrem beschleunigter Herzschlag im Brustkorb.", snomedCode: "80313002" },
                        { symptomName: "Husten mit blutigem Schleim oder Auswurf", schmerzen: false, symptomValue: "Hämoptoe: Husten mit Beimengung von frischem Blut oder bräunlichem Auswurf.", snomedCode: "66857006" }
                    ]
            },
            {
                step: "RueckenOben",
                symptoms:
                    [
                        { symptomName: "Hexenschuss (Akuter, einschießender Schmerz)", schmerzen: true, symptomValue: "Lumbago: Akut einschießender, blockierender Schmerz im Lendenwirbelbereich.", snomedCode: "279039003" },
                        { symptomName: "Ausstrahlender Schmerz ins Bein mit Kribbeln", schmerzen: true, symptomValue: "Ischialgie: Schmerz strahlt über das Gesäß bis in den Fuß aus, teils mit Taubheitsgefühl.", snomedCode: "400003" },
                        { symptomName: "Morgensteifigkeit der Wirbelsäule (> 30 Min.)", schmerzen: true, symptomValue: "Morgensteifigkeit: Wirbelsäule ist nach dem Aufstehen spürbar steif, Besserung durch Bewegung.", snomedCode: "162223005" },
                        { symptomName: "Schmerz verstärkt sich beim tiefen Einatmen", schmerzen: true, symptomValue: "Interkostal-Schmerz: Schmerz zieht gürtelförmig um den Brustkorb, atemabhängig.", snomedCode: "247363004" }
                    ]
            },
            {
                step: "RueckenUnten",
                symptoms:
                    [
                        { symptomName: "Hexenschuss (Akuter, einschießender Schmerz)", schmerzen: true, symptomValue: "Lumbago: Akut einschießender, blockierender Schmerz im Lendenwirbelbereich.", snomedCode: "279039003" },
                        { symptomName: "Ausstrahlender Schmerz ins Bein mit Kribbeln", schmerzen: true, symptomValue: "Ischialgie: Schmerz strahlt über das Gesäß bis in den Fuß aus, teils mit Taubheitsgefühl.", snomedCode: "400003" },
                        { symptomName: "Morgensteifigkeit der Wirbelsäule (> 30 Min.)", schmerzen: true, symptomValue: "Morgensteifigkeit: Wirbelsäule ist nach dem Aufstehen spürbar steif, Besserung durch Bewegung.", snomedCode: "162223005" },
                        { symptomName: "Schmerz verstärkt sich beim tiefen Einatmen", schmerzen: true, symptomValue: "Interkostal-Schmerz: Schmerz zieht gürtelförmig um den Brustkorb, atemabhängig.", snomedCode: "247363004" }
                    ]
            },
            {
                step: "genitalHarnwege",
                symptoms:
                    [
                        { symptomName: "Brennen oder Schmerzen beim Wasserlassen", schmerzen: true, symptomValue: "Dysurie: Brennender, stechender Schmerz in der Harnröhre während oder direkt nach dem Urinieren.", snomedCode: "47826000" },
                        { symptomName: "Ständiger, starker Harndrang", schmerzen: false, symptomValue: "Pollakisurie: Häufiges Aufsuchen der Toilette bei jeweils nur sehr geringen Urinmengen.", snomedCode: "162215003" },
                        { symptomName: "Erschwertes Wasserlassen / Abgeschwächter Harnstrahl", schmerzen: false, symptomValue: "Harnretention-Anfang: Das Wasserlassen beginnt verzögert, der Harnstrahl ist auffällig schwach oder unterbrochen.", snomedCode: "53526005" },
                        { symptomName: "Sichtbares Blut im Urin", schmerzen: false, symptomValue: "Makrohämaturie: Der Urin ist rötlich, fleischwasserfarben oder dunkelbraun verfärbt.", snomedCode: "266141005" }
                    ]
            },
            {
                step: "genitalSymptomeWeiblich",
                symptoms:
                    [
                        { symptomName: "Auffälliger Ausfluss (Farbe/Geruch verändert)", schmerzen: false, symptomValue: "Pathologischer Fluor: Vermehrter Ausfluss, der gelblich, grünlich oder krümelig-weiß ist, oder fischig/unangenehm riecht.", snomedCode: "248986005" },
                        { symptomName: "Starker Juckreiz oder Brennen im Intimbereich", schmerzen: false, symptomValue: "Vaginaler Juckreiz: Quälendes Jucken oder Brennen an den Schamlippen oder am Scheideneingang (z.B. Verdacht auf Pilzinfektion).", snomedCode: "248984007" },
                        { symptomName: "Zwischenblutungen oder unregelmäßige Zyklen", schmerzen: false, symptomValue: "Metrorrhagie: Blutungen außerhalb der normalen Menstruation oder nach den Wechseljahren.", snomedCode: "41312005" },
                        { symptomName: "Starke Schmerzen bei der Menstruation", schmerzen: true, symptomValue: "Dysmenorrhö: Krampfartige, stark einschränkende Unterleibsschmerzen während der Periode.", snomedCode: "302787002" },
                        { symptomName: "Schmerzen beim oder nach dem Geschlechtsverkehr", schmerzen: true, symptomValue: "Dyspareunie: Schmerzen im Bereich der Scheide oder tief im Unterleib bei sexueller Intimität.", snomedCode: "5080000" },
                        { symptomName: "Tastbare Knoten oder Schwellung der Schamlippen", schmerzen: false, symptomValue: "Schwellung im Intimbereich: Tastbare Verhärtungen oder schmerzhafte Schwellungen (z.B. Bartholini-Zyste).", snomedCode: "248981009" }
                    ]
            },
            {
                step: "genitalSymptomeMaennlich",
                symptoms:
                    [
                        { symptomName: "Schwellung oder Verhärtung des Hodens (schmerzlos)", schmerzen: false, symptomValue: "Hodenschwellung: Neu aufgetretene, schmerzlose Vergrößerung oder harter Knoten im Hoden (wichtiges Abklärungssignal!).", snomedCode: "248853005" },
                        { symptomName: "Ziehender Schmerz im Hoden oder Leistenbereich", schmerzen: true, symptomValue: "Hodenbeschwerden: Dumpfer, ziehender Schmerz im Hoden, der sich beim Stehen oder Gehen verstärken kann.", snomedCode: "274140003" },
                        { symptomName: "Ausfluss aus der Harnröhre", schmerzen: false, symptomValue: "Urethraler Ausfluss: Wässriger, schleimiger oder eitriger Ausfluss aus dem Penis außerhalb des Wasserlassens.", snomedCode: "248821008" },
                        { symptomName: "Schmerzen oder Druckgefühl zwischen Anus und Genital", schmerzen: true, symptomValue: "Prostatitis-Verdacht: Schmerzen im Dammbereich, oft ausstrahlend in den unteren Rücken oder Hoden.", snomedCode: "248843003" },
                        { symptomName: "Rötung, Juckreiz oder Belag auf Eichel/Vorhaut", schmerzen: false, symptomValue: "Balanitis: Entzündung der Eichel mit Juckreiz, Rötung oder weißen, trockenen Belägen.", snomedCode: "266112002" }
                    ]
            },
            {
                step: "genitalSymptomeDivers",
                symptoms:
                    [
                        { symptomName: "Starker Juckreiz, Brennen oder Rötung", schmerzen: false, symptomValue: "Pruritus/Entzündung: Quälendes Jucken oder brennendes Gefühl an den äußeren Genitalien oder Schleimhäuten.", snomedCode: "248984007" },
                        { symptomName: "Auffälliger Ausfluss (Menge, Farbe oder Geruch)", schmerzen: false, symptomValue: "Pathologischer Ausfluss: Ungewöhnliche Flüssigkeitsabgabe aus den Genitalien oder der Harnröhre.", snomedCode: "248986005" },
                        { symptomName: "Bläschen, offene Stellen oder Geschwüre", schmerzen: true, symptomValue: "Ulzera/Bläschen: Kleine, schmerzhafte Flüssigkeitsbläschen, Verkrustungen oder wunde Hautstellen im Intimbereich.", snomedCode: "247547007" },
                        { symptomName: "Schmerzen beim oder nach dem Geschlechtsverkehr", schmerzen: true, symptomValue: "Dyspareunie: Schmerzen im Genital- oder tiefen Beckenbereich während oder nach Intimität.", snomedCode: "5080000" },
                        { symptomName: "Tastbare Knoten, Schwellungen oder Raumforderungen", schmerzen: false, symptomValue: "Genitale Gewebeveränderung: Neu aufgetretene Knoten oder Schwellungen im Intimbereich.", snomedCode: "248981009" }
                    ]
            },
            {
                step: "genitalWarnsignale",
                symptoms:
                    [
                        { symptomName: "Plötzlicher, extremer Hodenschmerz", schmerzen: true, symptomValue: "Hoden-Red-Flag: Akut einsetzender, unerträglicher Schmerz in einem Hoden (Verdacht auf Hodentorsion - sofortiger Notfall bei biologisch männlich).", snomedCode: "274140003" },
                        { symptomName: "Vollständige Harnsperre (Unfähigkeit zu urinieren)", schmerzen: true, symptomValue: "Akuter Harnverhalt: Trotz extremer, schmerzhafter Drangbeschwerden kann kein Urin abgegeben werden (Akuter Notfall!).", snomedCode: "28442001" },
                        { symptomName: "Schmerzhafte Dauererektion > 4 Std.", schmerzen: true, symptomValue: "Priapismus: Schmerzhafte Erektion des Penises ohne sexuelle Stimulation (Gefahr von Gewebeschäden).", snomedCode: "30588006" },
                        { symptomName: "Akuter, heftigster Unterleibsschmerz", schmerzen: true, symptomValue: "Unterbauch-Katastrophe: Plötzlich einschießende, messerscharfe Unterleibsschmerzen mit harter Bauchdecke, Kreislaufschwäche oder Fieber (z.B. Verdacht auf Eileiterschwangerschaft/Zystenruptur bei biologisch weiblich).", snomedCode: "9209005" }
                    ]
            },
            {
                step: "beineGelenke",
                symptoms:
                    [
                        { symptomName: "Anlaufschmerz am Morgen / nach Pausen", schmerzen: true, symptomValue: "Anlaufschmerz: Gelenkschmerz (oft Knie oder Hüfte) bei den ersten Schritten nach Ruhephasen, der nach einigen Minuten Bewegung nachlässt (typisch für Arthrose).", snomedCode: "249710008" },
                        { symptomName: "Belastungsabhängiger Gelenkschmerz", schmerzen: true, symptomValue: "Belastungsschmerz: Schmerzen, die erst bei längerer Gehstrecke, Sport oder beim Treppenabsteigen auftreten und in Ruhe wieder verschwinden.", snomedCode: "247346004" },
                        { symptomName: "Ruheschmerz / Nächtlicher Gelenkschmerz", schmerzen: true, symptomValue: "Gelenk-Ruheschmerz: Schmerzen im Gelenk auch ohne Belastung, besonders stark in der Nacht oder im Liegen (Hinweis auf Entzündung oder fortgeschrittenen Verschleiß).", snomedCode: "247350003" },
                        { symptomName: "Überwärmtes, rotes und geschwollenes Gelenk", schmerzen: true, symptomValue: "Arthritis-Verdacht: Ein einzelnes Gelenk ist stark geschwollen, deutlich überwärmt, gerötet und extrem druckschmerzhaft (Verdacht auf Gichtanfall oder bakterielle Entzündung).", snomedCode: "3723001" },
                        { symptomName: "Morgensteifigkeit der Gelenke (> 30 Min.)", schmerzen: false, symptomValue: "Morgensteifigkeit Bein: Die Gelenke fühlen sich nach dem Aufwachen für längere Zeit wie eingerostet und unbeweglich an.", snomedCode: "162223005" },
                        { symptomName: "Hörbares Knirschen oder Reiben im Gelenk", schmerzen: false, symptomValue: "Krepitation: Spürbares oder hörbares Reiben („Schneeballknirschen“) im Gelenk bei Bewegung.", snomedCode: "289452003" },
                        { symptomName: "Gefühl der Instabilität / Wegknicken des Knies", schmerzen: false, symptomValue: "Instabilitätsgefühl: Das Gefühl, das Gelenk hält nicht stand, oder das Knie knickt bei Belastung unwillkürlich weg (Verdacht auf Bänderriss / Meniskusschaden).", snomedCode: "249658003" },
                        { symptomName: "Blockierung des Gelenks / Bewegungseinschränkung", schmerzen: true, symptomValue: "Gelenkblockade: Das Gelenk lässt sich plötzlich ab einem bestimmten Winkel nicht mehr weiter strecken oder beugen.", snomedCode: "249821003" }
                    ]
            },
            {
                step: "beineMuskeln",
                symptoms:
                    [
                        { symptomName: "Nächtliche Wadenkrämpfe", schmerzen: true, symptomValue: "Wadenkrampf: Plötzlich einschießende, schmerzhafte Muskelverhärtung der Wade, meistens im Schlaf.", snomedCode: "439243003" },
                        { symptomName: "Anhaltender Muskelkater / Diffuser Muskelschmerz", schmerzen: true, symptomValue: "Myalgie: Großflächiger, ziehender Druckschmerz in den Muskeln (z. B. nach Überlastung oder bei viralen Infekten).", snomedCode: "68962001" },
                        { symptomName: "Punktueller, messerscharfer Schmerz nach Belastung", schmerzen: true, symptomValue: "Muskelfaserriss: Plötzlich einschießender, stechender Schmerz bei einer Bewegung, Gehen oder Laufen danach kaum noch möglich.", snomedCode: "297120005" },
                        { symptomName: "Schmerzen an der Achillessehne bei Druck/Belastung", schmerzen: true, symptomValue: "Achillodynie: Schmerzhafter, oft verdickter Bereich an der Sehne über der Ferse, besonders beim Abstoßen des Fußes.", snomedCode: "247384000" },
                        { symptomName: "Schienbeinkantenschmerz (Shin Splints)", schmerzen: true, symptomValue: "Periostitis: Belastungsschmerz an der Vorderseite des Unterschenkels entlang des Schienbeinknochens (häufig bei Läufern).", snomedCode: "40715003" }
                    ]
            },
            {
                step: "beineNervenGefaese",
                symptoms:
                    [
                        { symptomName: "Krampfartige Wadenschmerzen beim Gehen (Gehpausen nötig)", schmerzen: true, symptomValue: "pAVK / Schaufensterkrankheit: Schmerzen in der Wade, die nach einer bestimmten Gehstrecke auftreten und zum Stehenbleiben zwingen; bessern sich rasch im Stehen.", snomedCode: "20661009" },
                        { symptomName: "Einschießen von Schmerzen vom Rücken ins Bein", schmerzen: true, symptomValue: "Ischialgie: Elektrisierender oder ziehender Schmerz, der vom Gesäß über die Rückseite des Beins bis in den Fuß ausstrahlt.", snomedCode: "400003" },
                        { symptomName: "Kribbeln, Taubheitsgefühl oder „Ameisenlaufen“", schmerzen: false, symptomValue: "Parästhesien: Missempfindungen, pelziges Gefühl oder Taubheit (häufig an den Füßen oder Zehen, z. B. bei Polyneuropathie).", snomedCode: "43214002" },
                        { symptomName: "Schwere, müde Beine und geschwollene Knöchel am Abend", schmerzen: false, symptomValue: "Venöse Insuffizienz: Spannungsgefühl und Schwellung der Beine, die sich im Laufe des Tages verschlimmern und bei Hochlagern besser werden.", snomedCode: "271813007" },
                        { symptomName: "Unruhige Beine am Abend / im Liegen (Bewegungsdrang)", schmerzen: false, symptomValue: "Restless-Legs-Syndrom: Quälender Unruhezustand oder Missempfindungen in den Beinen, die nur durch Aufstehen und Umhergehen kurzzeitig besser werden.", snomedCode: "109315003" },
                        { symptomName: "Chronisch kalte Füße oder bläuliche Verfärbung", schmerzen: false, symptomValue: "Durchblutungsstörung peripher: Füße sind dauerhaft kalt, schlecht durchblutet, Zehen verfärben sich bei Kälte blass oder bläulich.", snomedCode: "302008008" }
                    ]
            },
            {
                step: "beineWarnsignale",
                symptoms:
                    [
                        { symptomName: "Einseitig stark geschwollene, heiße, rote Wade", schmerzen: true, symptomValue: "Thrombose-Red-Flag: Einseitige Umfangszunahme des Unterschenkels, die Haut glänzt, ist überwärmt, gerötet und schmerzt wie ein Muskelkater (Akuter Notfall!).", snomedCode: "274138005" },
                        { symptomName: "Plötzlicher, unerträglicher Beinschmerz + Blässe + Kälte", schmerzen: true, symptomValue: "Akuter Arterienverschluss: Schlagartig einsetzender, heftigster Schmerz, der Fuß/das Bein wird eiskalt, blass und der Puls am Fuß ist nicht mehr tastbar (Sofortiger Notfall!).", snomedCode: "274134007" },
                        { symptomName: "Lähmung / Fuß kann nicht mehr angehoben werden", schmerzen: false, symptomValue: "Peroneuslähmung / Fußheberparese: Plötzliche Unfähigkeit, die Fußspitze beim Gehen anzuheben (Schlurfender Gang / neurologisches Warnsignal).", snomedCode: "249948006" },
                        { symptomName: "Schlecht heilende Wunden oder Geschwüre am Fuß", schmerzen: false, symptomValue: "Ulkus / Diabetischer Fuß: Offene, nicht abheilende Hautstellen, Gewebeveränderungen oder dunkle Flecken an den Zehen oder Fersen (besonders riskant bei Diabetes).", snomedCode: "232353008" },
                        { symptomName: "Umknicktrauma mit sofortiger massiver Schwellung", schmerzen: true, symptomValue: "Schwere Distorsion / Fraktur: Nach einem Unfall oder Umknicken schwillt das Gelenk sofort massiv an, Auftreten oder Belastung ist völlig unmöglich.", snomedCode: "6456007" }
                    ]
            },
            {
                step: "Keine bestimmte Region / mehrere Stellen",
                symptoms:
                    [
                        { symptomName: "Schüttelfrost / Unkontrollierbares Zittern", schmerzen: false, symptomValue: "Schüttelfrost: Unkontrollierbares Zittern am ganzen Körper bei rasant steigendem Fieber.", snomedCode: "43724002" },
                        { symptomName: "Unerklärlicher, schneller Gewichtsverlust", schmerzen: false, symptomValue: "Gewichtsverlust: Ungewollte Gewichtsabnahme ohne Diät oder Ernährungsumstellung.", snomedCode: "262285001" },
                        { symptomName: "Anhaltende Nachtschweiße (Kleidungswechsel nötig)", schmerzen: false, symptomValue: "B-Symptomatik: Massives Schwitzen in der Nacht, sodass Schlafkleidung gewechselt werden muss.", snomedCode: "422696006" },
                        { symptomName: "Ausgeprägte, bleierne Müdigkeit und Abgeschlagenheit", schmerzen: false, symptomValue: "Fatigue/Schwäche: Extreme Antriebslosigkeit, die den Alltag massiv einschränkt.", snomedCode: "84229001" },
                        { symptomName: "Extreme Kältegefühle trotz warmem Raum", schmerzen: false, symptomValue: "Extreme Kältegefühle, obwohl es im Raum warm ist", snomedCode: "274640006" },
                        { symptomName: "Diffuse Gliederschmerzen (wie bei echter Grippe)", schmerzen: true, symptomValue: "Diffuse Gliederschmerzen (die Muskeln, Gelenke und Knochen tun am ganzen Körper weh, wie bei einer echten Grippe)", snomedCode: "248482006" },
                        { symptomName: "Tastbare, schmerzhafte Lymphknotenschwellung", schmerzen: true, symptomValue: "Deutlich tastbare, schmerzhafte oder geschwollene Knubbel am Hals, unter den Achseln oder in der Leiste (Lymphknoten)", snomedCode: "274112004" },
                        { symptomName: "Verwirrtheit, Schläfrigkeit & Atembeschwerden", schmerzen: false, symptomValue: "Plötzliche, schwere Verwirrtheit, extreme Schläfrigkeit, Atemnot und sehr schneller Herzschlag bei einer Infektion", snomedCode: "85828009" },
                        { symptomName: "Rote/lila Hautpunkte (nicht verblassend)", schmerzen: false, symptomValue: "Auftreten von kleinen, stecknadelkopfgroßen, roten oder lila Hautpunkten, die bei Druck (z. B. mit einem Glas) nicht verblassen", snomedCode: "271818003" },
                        { symptomName: "Plötzliche, große blaue Flecken ohne Stoßen", schmerzen: false, symptomValue: "Plötzliches Auftreten von großen, blauen Flecken am Körper, ohne dass man sich gestoßen oder verletzt hat", snomedCode: "247511005" }
                    ]
            },
        ]

    if (gender === "weiblich") {
        const genitalWarn = symptomList.find(s => s.step === "genitalWarnsignale");
        if (genitalWarn) {
            genitalWarn.symptoms = genitalWarn.symptoms.filter(
                s => s.symptomName !== "Plötzlicher, extremer Hodenschmerz (Notfall!)" &&
                    s.symptomName !== "Schmerzhafte Dauererektion > 4 Std. (Priapismus)"
            );
        }
    }

    return symptomList;
}
