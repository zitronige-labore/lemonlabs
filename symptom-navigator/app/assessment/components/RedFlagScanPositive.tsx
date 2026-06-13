import homeStyles from "../../Home.module.css";

type RedFlagPositiveProps = {
  redFlagScanResult: string[]
};

export function RedFlagPositive({ redFlagScanResult }: RedFlagPositiveProps) {


  return (
    <div className={homeStyles.sosModalOverlay}>
      <div className={homeStyles.sosModalBox}>
        <h2 className={homeStyles.emergencyTitleModal}>Ein Warnsignal wurde erkannt</h2>
        
        <p className={homeStyles.warningText}>
          diese Angaben haben dazu gefuehrt:
        </p>
        
        <p className={homeStyles.sosInstruction}>
          
        </p>
      </div>
    </div>
  );
}