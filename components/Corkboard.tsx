"use client";

import { useCallback, useState } from "react";
import SceneCard, { SceneCardData } from "./SceneCard";

// Scene card data exactly matching the design mockup
const DEFAULT_CARDS: SceneCardData[] = [
  {
    id: "1",
    sceneNumber: 1,
    title: "The Phone Call",
    description:
      "Mara receives a late-night call from a number she doesn't recognize. A voice says only: \"They found the archive.\"",
    label: "HOOK",
    color: "yellow",
    pinStyle: "pin",
    pinColor: "#c0392b",
    rotation: -1.5,
    x: 48,
    y: 130,
  },
  {
    id: "2",
    sceneNumber: 2,
    title: "The Old Apartment",
    description:
      "Mara visits her childhood home, now abandoned. She finds a folder hidden behind a loose baseboard. Inside: surveillance photos of herself.",
    label: "SETUP",
    color: "blue",
    pinStyle: "pin",
    pinColor: "#2980b9",
    rotation: 1.2,
    x: 268,
    y: 110,
  },
  {
    id: "3",
    sceneNumber: 3,
    title: "Back to the Library",
    description:
      "Mara returns to the restricted archive she thought was sealed. The door is open. A single folder sits on the table.",
    label: "INCITING",
    color: "green",
    pinStyle: "tape",
    rotation: 0.8,
    x: 60,
    y: 360,
  },
  {
    id: "4",
    sceneNumber: 4,
    title: "The Photograph",
    description:
      "Inside the folder: a photograph of her mother, dated five years after she supposedly died. Mara's whole story unravels.",
    label: "TURN",
    color: "pink",
    pinStyle: "pin",
    pinColor: "#e74c3c",
    rotation: -2,
    x: 280,
    y: 340,
  },
  {
    id: "5",
    sceneNumber: 5,
    title: "The Informant",
    description:
      "A man named Decker meets Mara at a diner. He claims to know where her mother has been hiding — and why she had to disappear.",
    label: "RISING",
    color: "yellow",
    pinStyle: "tape",
    rotation: 1.8,
    x: 530,
    y: 120,
  },
  {
    id: "6",
    sceneNumber: 6,
    title: "Decker's Warning",
    description:
      "Decker explains the organization that erased her mother. They are still watching. One wrong move and the archive gets buried forever.",
    label: "RISING",
    color: "lavender",
    pinStyle: "pin",
    pinColor: "#8e44ad",
    rotation: -1.1,
    x: 748,
    y: 105,
  },
  {
    id: "7",
    sceneNumber: 7,
    title: "The Safe House",
    description:
      "Mara and Decker locate the address from the folder. The house is occupied. A woman answers the door. It's her mother.",
    label: "MIDPOINT",
    color: "peach",
    pinStyle: "tape",
    rotation: -0.7,
    x: 545,
    y: 355,
  },
  {
    id: "8",
    sceneNumber: 8,
    title: "The Real Betrayal",
    description:
      "Her mother reveals that Decker is an operative. He led them here. The reunion turns into a trap.",
    label: "COMPLICATION",
    color: "blue",
    pinStyle: "pin",
    pinColor: "#1a6fa8",
    rotation: 2.3,
    x: 763,
    y: 340,
  },
  {
    id: "9",
    sceneNumber: 9,
    title: "The Escape",
    description:
      "Mara and her mother flee through the back of the house. They have ten minutes before the archive goes offline forever.",
    label: "CRISIS",
    color: "green",
    pinStyle: "tape",
    rotation: -1.4,
    x: 1030,
    y: 115,
  },
  {
    id: "10",
    sceneNumber: 10,
    title: "Broadcast",
    description:
      "Mara uploads the archive to a dead drop. The files go public. She watches the news tickers roll as the organisation collapses in real time.",
    label: "CLIMAX",
    color: "pink",
    pinStyle: "pin",
    pinColor: "#c0392b",
    rotation: 1.6,
    x: 1248,
    y: 130,
  },
  {
    id: "11",
    sceneNumber: 11,
    title: "Morning Light",
    description:
      "Mother and daughter sit in a café. No more running. The maps on Mara's wall finally mean somewhere to go, not somewhere to leave.",
    label: "RESOLUTION",
    color: "yellow",
    pinStyle: "tape",
    rotation: -0.5,
    x: 1040,
    y: 360,
  },
];

export default function Corkboard() {
  const [cards, setCards] = useState<SceneCardData[]>(DEFAULT_CARDS);

  const handleMove = useCallback((id: string, x: number, y: number) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, x, y } : c)));
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#c4904f",
        backgroundImage: [
          "radial-gradient(ellipse at 20% 30%, rgba(180,120,50,0.4) 0%, transparent 50%)",
          "radial-gradient(ellipse at 80% 70%, rgba(160,100,30,0.3) 0%, transparent 40%)",
          "radial-gradient(ellipse at 50% 50%, rgba(200,150,80,0.2) 0%, transparent 60%)",
          "radial-gradient(ellipse at 10% 80%, rgba(140,90,20,0.25) 0%, transparent 35%)",
          "radial-gradient(ellipse at 90% 10%, rgba(190,130,60,0.3) 0%, transparent 40%)",
        ].join(", "),
      }}
    >
      {/* Act labels — large ghost text */}
      {(
        [
          { label: "ACT I", left: 48, top: 60 },
          { label: "ACT II", left: 520, top: 60 },
          { label: "ACT III", left: 1020, top: 60 },
        ] as const
      ).map(({ label, left, top }) => (
        <span
          key={label}
          style={{
            position: "absolute",
            left,
            top,
            fontFamily: "'Caveat', cursive",
            color: "rgba(255,255,255,0.18)",
            fontSize: 72,
            fontWeight: 700,
            pointerEvents: "none",
            userSelect: "none",
            letterSpacing: 2,
          }}
        >
          {label}
        </span>
      ))}

      {/* Act dividers */}
      {[490, 990].map((left) => (
        <div
          key={left}
          style={{
            position: "absolute",
            left,
            top: 40,
            bottom: 40,
            width: 2,
            background: "rgba(255,255,255,0.07)",
            borderRadius: 1,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Decorative connecting strings — always below cards */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        {/* Act I: Card 1 → Card 3 */}
        <path d="M 144 285 Q 144 330 156 360" stroke="rgba(160,100,40,0.3)" strokeWidth="1" fill="none" strokeDasharray="4 3" />
        {/* Act I: Card 2 → Card 4 */}
        <path d="M 364 260 Q 370 310 376 340" stroke="rgba(160,100,40,0.3)" strokeWidth="1" fill="none" strokeDasharray="4 3" />
        {/* Act I → Act II: Card 3 → Card 7 */}
        <path d="M 252 440 Q 400 460 545 440" stroke="rgba(160,100,40,0.25)" strokeWidth="1" fill="none" strokeDasharray="4 3" />
        {/* Act II: Card 5 → Card 7 */}
        <path d="M 626 295 Q 630 335 641 355" stroke="rgba(160,100,40,0.3)" strokeWidth="1" fill="none" strokeDasharray="4 3" />
        {/* Act II: Card 7 → Card 8 */}
        <path d="M 737 440 Q 750 450 763 430" stroke="rgba(160,100,40,0.3)" strokeWidth="1" fill="none" strokeDasharray="4 3" />
        {/* Act II → III: Card 8 → Card 9 */}
        <path d="M 955 430 Q 995 420 1030 360" stroke="rgba(160,100,40,0.25)" strokeWidth="1" fill="none" strokeDasharray="4 3" />
        {/* Act III: Card 9 → Card 10 */}
        <path d="M 1222 200 Q 1235 200 1248 210" stroke="rgba(160,100,40,0.3)" strokeWidth="1" fill="none" strokeDasharray="4 3" />
      </svg>

      {/* Scene cards */}
      {cards.map((card) => (
        <SceneCard key={card.id} card={card} onMove={handleMove} />
      ))}

      {/* Sticky note */}
      <div
        style={{
          position: "absolute",
          left: 1260,
          top: 370,
          width: 170,
          transform: "rotate(2.5deg)",
          backgroundColor: "#fef9ec",
          borderLeft: "3px solid #e8b84b",
          borderRadius: 2,
          padding: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "1rem",
            color: "#374151",
            lineHeight: 1.35,
            margin: 0,
          }}
        >
          💡 Need a scene where Mara discovers the photo is{" "}
          <em>a forgery</em>? Creates a false hope beat before the safe house
          reveal.
        </p>
      </div>

      {/* Canvas hints */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(0,0,0,0.2)",
          color: "rgba(255,255,255,0.5)",
          fontSize: 12,
          padding: "6px 12px",
          borderRadius: 9999,
          backdropFilter: "blur(4px)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
            clipRule="evenodd"
          />
        </svg>
        Drag cards freely · Double-click to edit
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(0,0,0,0.2)",
          color: "rgba(255,255,255,0.5)",
          fontSize: 12,
          padding: "6px 12px",
          borderRadius: 9999,
          backdropFilter: "blur(4px)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
          />
        </svg>
        Scroll or pinch to zoom
      </div>
    </div>
  );
}
