import Link from "next/link";
import homeStyles from "../Home.module.css";

export default function OtherPage() {
    return (
        <main className={homeStyles.main}>
            <div className={homeStyles.hauptbox}>
                <div className={homeStyles.kopfbox}>
                    <div className={homeStyles.header}>
                        <h1 className={homeStyles.title}>Termine</h1>
                    </div>
                    <div
                        style={{
                            marginTop: "24px",
                            background: "#ffffff",
                            borderRadius: "12px",
                            padding: "20px",
                            border: "1px solid #d1d5db",
                        }}
                    >

                        <p
                            style={{
                                color: "#000000",
                                lineHeight: "1.6",
                                marginBottom: "16px",
                            }}
                        >
                            Vereinbaren Sie online einen Termin beim Robert Bosch Krankenhaus
                            Stuttgart.
                        </p>

                        <a
                            href="https://patientenportal.rbk.de/type"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={homeStyles.primaryButton}
                            style={{
                                textDecoration: "none",
                                display: "inline-flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            Zur Online-Terminvergabe
                        </a>
                    </div>

                    <div className={homeStyles.buttonBox}>
                        <Link
                            href="/"
                            className={homeStyles.primaryButton}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                textDecoration: "none",
                            }}
                        >
                            Zurück zur Startseite
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}