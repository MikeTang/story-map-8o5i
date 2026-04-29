import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Story Map — Scene Board",
  description: "A cozy corkboard for mapping out the scenes of a novel or screenplay.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Caveat for handwritten card text; Lato for UI chrome */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          height: "100dvh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Lato', sans-serif",
          backgroundColor: "#b5824a",
        }}
      >
        {children}
      </body>
    </html>
  );
}
