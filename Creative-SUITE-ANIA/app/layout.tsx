import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creative Suite ANIA",
  description: "Generador profesional de infografías con IA para televisión, gobierno, clima, seguridad e instituciones.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
