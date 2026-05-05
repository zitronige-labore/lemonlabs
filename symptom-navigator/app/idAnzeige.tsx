"use client"
import { useSearchParams } from "next/navigation";

export default function IdAnzeige() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    return (
        <p style={{color: "#000000"}}> ID welche gerade erstellt wurde: {id} </p>
    );
}