/*
  Komponente zur Entscheidung, ob weitere Symptome erfasst werden sollen.

  Sie erscheint nach der Freitexteingabe oder nach einer Symptomauswahl
  und verzweigt entweder zurück zur Körperregion-Auswahl oder weiter
  in den nächsten passenden Schritt.
*/
"use client"

/*
  Styles für Formularflächen, Auswahlbuttons und vertikale Button-Gruppen.
*/
import assessmentStyles from "../Assessment.module.css";

/*
  Typen für die zentrale Ablaufsteuerung und die Körperregion-Auswahl.
*/
import { Step, MainRegion, SubRegion } from "../../types/assessment";

/*
  Eigenschaften der SelectMoreSymptoms-Komponente.

  setStep:
  Navigiert zum nächsten Schritt im Assessment-Ablauf.

  setSelectedMainRegion / setSelectedSubRegion:
  Setzen die aktuelle Region zurück, wenn ein weiteres Symptom
  an einer anderen Stelle erfasst werden soll.

  checkInfoActive:
  Merkt, ob der Nutzer aus der Prüfansicht zurückgekommen ist.
  In diesem Fall führt "nein" wieder zur Prüfung statt zu den Zusatzangaben.
*/
interface SelectMoreSymptomsProps {
  setStep: (step: Step) => void;
  setSelectedMainRegion: (mainRegion: MainRegion | null) => void;
  setSelectedSubRegion: (subRegion: SubRegion | null) => void;
  checkInfoActive: boolean;
}

/*
  Fragt nach jedem erfassten Symptom, ob weitere Beschwerden ergänzt
  oder die vorhandenen Angaben fortgeführt beziehungsweise geprüft werden sollen.
*/
export default function SelectMoreSymptoms({setStep, setSelectedMainRegion, setSelectedSubRegion, checkInfoActive}: SelectMoreSymptomsProps) {
  return (
    <>

    <fieldset className={assessmentStyles.fieldset}>
                  <legend className={assessmentStyles.legend}>
                    Wollen Sie noch mehr Symptome angeben?
                  </legend>

                <div className={assessmentStyles.quickSelect}>
                    <button
                      type="button"
                      className={assessmentStyles.regionButton}
                      onClick={() => {
                        /*
                          Für ein weiteres Symptom wird die Regionsauswahl
                          neu gestartet, damit keine vorherige Körperregion
                          versehentlich übernommen wird.
                        */
                        setStep("bodyRegion");
                        setSelectedMainRegion(null);
                        setSelectedSubRegion(null);
                      }}
                    >
                      ja
                    </button>

                    <button
                      type="button"
                      className={assessmentStyles.regionButton}
                      onClick={() => {
                        /*
                          Wenn die Nutzerin oder der Nutzer aus der Prüfseite
                          zurückkam, führt "nein" wieder dorthin.
                          Im normalen Ablauf geht es zu den Zusatzangaben.
                        */
                        if (checkInfoActive) {
                          setStep("checkInfo");
                        }
                        else {
                          setStep("additionalInfo");
                        }
                      }}
                    >
                      nein
                    </button>
                  </div>   
                </fieldset>
      </>
  );
}
