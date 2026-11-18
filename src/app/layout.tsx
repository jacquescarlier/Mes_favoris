import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mes Favoris",
  description: "Gestionnaire de favoris internet par catégories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/40 via-slate-950 to-slate-950 text-slate-100 antialiased min-h-screen flex flex-col justify-between">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-slate-800/80 py-3 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} JCR &amp; Pit. Tous droits réservés.
        </footer>
      </body>
    </html>
  );
}
