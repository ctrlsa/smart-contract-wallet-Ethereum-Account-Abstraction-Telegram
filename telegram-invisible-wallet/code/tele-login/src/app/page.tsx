"use client"; // This is a client component 👈🏽

import Image from "next/image";
import TelegramLogin from "@/app/tele_login";

export default function Home() {
    return (
        <TelegramLogin></TelegramLogin>
    );
}
