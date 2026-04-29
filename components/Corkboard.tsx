"use client";

import { useCallback, useRef, useState } from "react";
import SceneCard, { SceneCardData } from "./SceneCard";

// Default scene cards matching the design mockup
const DEFAULT_CARDS: SceneCardData[] = [
  {
    id: "1",
    sceneNumber: 1,
    title: "The Phone Call",
    description: "Mara receives a late-night call from a number she doesn't recognize. A voice says only: \"They found the archive.\"",
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
    description: "Mara visits her childhood home, now abandoned. She finds a folder hidden behind a loose baseboard. Inside: surveillance photos of herself.",
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
    title: "Missing Six Years",
    description: "Mara cross-references the photos with her own memories. Six years of her life are simply... not there. The last photo is dated yesterday.",
    label: "SETUP",
    color: "green",
    pinStyle: "tape",
    rotation: 0.8,
    x: 60,
    y: 360,
  },
  {
    id: "4",
    sceneNumber: 4,
    title: "The Contact",
    description: "Following a coded note in the folder, Mara makes contact with someone who claims to know her mother — who has been dead for six years.",
    label: "INCITING",
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
    description: "A man named Decker meets Mara at a diner. He claims to know where her mother has been hiding — and why she had to disappear.",
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
    description: "Decker explains the organization that erased her mother. They are still watching. One wrong move and the archive gets buried forever.",
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
    description: "Mara and Decker locate the address from the folder. The house is occupied. A woman answers the door. It's her mother.",
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
    title: "Mother's Secret",
    description: "Her mother explains she faked her death to protect Mara. The organization she once worked for doesn't let people simply leave.",
    label: "MIDPOINT",
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
    title: "They're Coming",
    description: "A black car parks outside the safe house. Her mother recognizes it immediately. They have less than four minutes to run.",
    label: "CLIMAX",
    color: "green",
    pinStyle: "pin",
    pinColor: "#27ae60",
    rotation: -1.4,
    x: 1030,
    y: 115,
  },
  {
    id: "10",
    sceneNumber: 10,
    title: "The Archive",
    description: "They make it to a storage facility. Her mother opens a locker — inside is a hard drive that contains evidence powerful enough to bring down the organization.",
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
    title: "A New Beginning",
    description: "The evidence is uploaded. The organization begins to collapse. Mara and her mother watch from a café window as the news breaks. They can finally stop running.",
    label: "RESOLUTION",
    color: "yellow",
    pinStyle: "tape",
    rotation: -0.5,
    x: 1040,
    y: 360,
  },
];

interface CardPosition {
  id: string;
  x: number;
  y: number;
}

export default function Corkboard() {
  // Session-only positions stored in state (the task says "no saving needed")
  const [cards, setCards] = useState<SceneCardData[]>(DEFAULT_CARDS);

  const handleMove = useCallback((id: string, x: number, y: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, x, y } : c))
    );
  }, []);

  return (
    <div
      className="cork-canvas"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        // Cork texture — warm layered radial gradients over a base amber
        backgroundColor: "#c4904f",
        backgroundImage: [
          "radial-gradient(ellipse at 20% 30%, rgba(180,120,50,0.4) 0%, transparent 50%)",
          "radial-gradient(ellipse at 80% 70%, rgba(160,100,30,0.3) 0%, transparent 40%)",
          "radial-gradient(ellipse at 50% 50%, rgba(200,150,80,0.2) 0%, transparent 60%)",
          "radial-gradient(ellipse at 10% 80%, rgba(140,90,20,0.25) 0%, transparent 35%)",
          "radial-gradient(ellipse at 90% 10%, rgba(190,130,60,0.3) 0%, transparent 40%)",
          // Subtle grid lines for depth
          "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.03) 39px, rgba(0,0,0,0.03) 40px)",
          "repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.03) 39px, rgba(0,0,0,0.03) 40px)",
        ].join(", "),
      }}
    >
      {/* Act labels */}
      <span
        style={{
          position: "absolute",
          left: 48,
          top: 60,
          fontFamily: "'Caveat', cursive",
          color: "rgba(255,255,255,0.18)",
          fontSize: 72,
          fontWeight: 700,
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: 2,
        }}
      >
        ACT I
      </span>
      <span
        style={{
          position: "absolute",
          left: 520,
          top: 60,
          fontFamily: "'Caveat', cursive",
          color: "rgba(255,255,255,0.18)",
          fontSize: 72,
          fontWeight: 700,
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: 2,
        }}
      >
        ACT II
      </span>
      <span
        style={{
          position: "absolute",
          left: 1020,
          top: 60,
          fontFamily: "'Caveat', cursive",
          color: "rgba(255,255,255,0.18)",
          fontSize: 72,
          fontWeight: 700,
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: 2,
        }}
      >
        ACT III
      </span>

      {/* Act dividers */}
      <div
        style={{
          position: "absolute",
          left: 490,
          top: 40,
          bottom: 40,
          width: 2,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 990,
          top: 40,
          bottom: 40,
          width: 2,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 1,
          pointerEvents: "none",
        }}
      />

      {/* Scene cards */}
      {cards.map((card) => (
        <SceneCard key={card.id} card={card} onMove={handleMove} />
      ))}
    </div>
  );
}
