"use client";

import { useCallback, useEffect, useState } from "react";
import SceneCard, { CardColor, SceneCardData } from "./SceneCard";
import AddSceneModal from "./AddSceneModal";
import { loadData, saveData } from "@/lib/storage";

// ─── Default scenes matching the design mockup ───────────────────────────────
const DEFAULT_CARDS: SceneCardData[] = [
  { id: "1",  sceneNumber: 1,  title: "The Phone Call",      description: "Mara receives a late-night call from a number she doesn't recognize. A voice says only: \"They found the archive.\"",                                                      label: "HOOK",         color: "yellow",   pinStyle: "pin",  pinColor: "#c0392b", rotation: -1.5, x: 48,   y: 130 },
  { id: "2",  sceneNumber: 2,  title: "The Old Apartment",   description: "Mara visits her childhood home, now abandoned. She finds a folder hidden behind a loose baseboard. Inside: surveillance photos of herself.",                                   label: "SETUP",        color: "blue",     pinStyle: "pin",  pinColor: "#2980b9", rotation:  1.2, x: 268,  y: 110 },
  { id: "3",  sceneNumber: 3,  title: "Back to the Library", description: "Mara returns to the restricted archive she thought was sealed. The door is open. A single folder sits on the table.",                                                          label: "INCITING",     color: "green",    pinStyle: "tape",                      rotation:  0.8, x: 60,   y: 360 },
  { id: "4",  sceneNumber: 4,  title: "The Photograph",      description: "Inside the folder: a photograph of her mother, dated five years after she supposedly died. Mara's whole story unravels.",                                                       label: "TURN",         color: "pink",     pinStyle: "pin",  pinColor: "#e74c3c", rotation: -2.0, x: 280,  y: 340 },
  { id: "5",  sceneNumber: 5,  title: "The Informant",       description: "A man named Decker meets Mara at a diner. He claims to know where her mother has been hiding — and why she had to disappear.",                                                  label: "RISING",       color: "yellow",   pinStyle: "tape",                      rotation:  1.8, x: 530,  y: 120 },
  { id: "6",  sceneNumber: 6,  title: "Decker's Warning",    description: "Decker explains the organisation that erased her mother. They are still watching. One wrong move and the archive gets buried forever.",                                         label: "RISING",       color: "lavender", pinStyle: "pin",  pinColor: "#8e44ad", rotation: -1.1, x: 748,  y: 105 },
  { id: "7",  sceneNumber: 7,  title: "The Safe House",      description: "Mara and Decker locate the address from the folder. The house is occupied. A woman answers the door. It's her mother.",                                                        label: "MIDPOINT",     color: "peach",    pinStyle: "tape",                      rotation: -0.7, x: 545,  y: 355 },
  { id: "8",  sceneNumber: 8,  title: "The Real Betrayal",   description: "Her mother reveals that Decker is an operative. He led them here. The reunion turns into a trap.",                                                                             label: "COMPLICATION", color: "blue",     pinStyle: "pin",  pinColor: "#1a6fa8", rotation:  2.3, x: 763,  y: 340 },
  { id: "9",  sceneNumber: 9,  title: "The Escape",          description: "Mara and her mother flee through the back of the house. They have ten minutes before the archive goes offline forever.",                                                        label: "CRISIS",       color: "green",    pinStyle: "tape",                      rotation: -1.4, x: 1030, y: 115 },
  { id: "10", sceneNumber: 10, title: "Broadcast",           description: "Mara uploads the archive to a dead drop. The files go public. She watches the news tickers roll as the organisation collapses in real time.",                                   label: "CLIMAX",       color: "pink",     pinStyle: "pin",  pinColor: "#c0392b", rotation:  1.6, x: 1248, y: 130 },
  { id: "11", sceneNumber: 11, title: "Morning Light",       description: "Mother and daughter sit in a café. No more running. The maps on Mara's wall finally mean somewhere to go, not somewhere to leave.",                                            label: "RESOLUTION",   color: "yellow",   pinStyle: "tape",                      rotation: -0.5, x: 1040, y: 360 },
];

const STORAGE_KEY = "story-map-scenes";

// Pin colours to cycle through for new cards
const PIN_COLORS: string[] = ["#c0392b", "#2980b9", "#8e44ad", "#27ae60", "#e67e22"];
const PIN_STYLES: ("pin" | "tape")[] = ["pin", "tape", "pin", "tape", "tape", "pin"];
const ROTATIONS = [-2.0, -1.5, -1.1, -0.7, -0.5, 0.8, 1.2, 1.6, 1.8, 2.3];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface Props {
  /** Called after cards state is ready so the parent can read scene count */
  onScenesChange?: (count: number) => void;
}

export default function Corkboard({ onScenesChange }: Props) {
  const [cards, setCards]         = useState<SceneCardData[]>([]);
  const [loaded, setLoaded]       = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ── Load persisted cards once ──────────────────────────────────────────────
  useEffect(() => {
    loadData<SceneCardData[]>(STORAGE_KEY)
      .then((saved) => {
        setCards(saved ?? DEFAULT_CARDS);
        setLoaded(true);
      })
      .catch(() => {
        setCards(DEFAULT_CARDS);
        setLoaded(true);
      });
  }, []);

  // ── Persist whenever cards change (skip the first render) ─────────────────
  useEffect(() => {
    if (!loaded) return;
    saveData(STORAGE_KEY, cards).catch(console.error);
    onScenesChange?.(cards.length);
  }, [cards, loaded, onScenesChange]);

  // ── Notify parent on load ──────────────────────────────────────────────────
  useEffect(() => {
    if (loaded) onScenesChange?.(cards.length);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);


  // ── Listen for toolbar "Add Scene" button via CustomEvent ────────────────
  useEffect(() => {
    const handler = () => setShowModal(true);
    window.addEventListener("story-map:open-add", handler);
    return () => window.removeEventListener("story-map:open-add", handler);
  }, []);
  const handleMove = useCallback((id: string, x: number, y: number) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, x, y } : c)));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setCards((prev) => {
      const next = prev.filter((c) => c.id !== id);
      // Re-number remaining cards to keep scene numbers sequential
      return next.map((c, i) => ({ ...c, sceneNumber: i + 1 }));
    });
  }, []);


  const handleUpdate = useCallback(
    (id: string, fields: Partial<Pick<SceneCardData, "title" | "description">>) => {
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...fields } : c)));
    },
    []
  );

  const handleAdd = useCallback(
    (title: string, description: string, color: CardColor) => {
      setCards((prev) => {
        const newCard: SceneCardData = {
          id:          crypto.randomUUID(),
          sceneNumber: prev.length + 1,
          title,
          description,
          label:       "SCENE",
          color,
          pinStyle:    randomItem(PIN_STYLES),
          pinColor:    randomItem(PIN_COLORS),
          rotation:    randomItem(ROTATIONS),
          // Drop near the centre of a ~1400×600 board with slight randomness
          x: 200 + Math.random() * 900,
          y: 120 + Math.random() * 300,
        };
        return [...prev, newCard];
      });
    },
    []
  );

  return (
    <>
      {/* ── Add Scene Button (floating, bottom-right corner) ─────────────── */}
      <button
        onClick={() => setShowModal(true)}
        title="Add scene"
        aria-label="Add scene"
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          zIndex: 50,
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "linear-gradient(180deg, #3d2b1f 0%, #2c1e14 100%)",
          border: "2px solid rgba(255,255,255,0.18)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 28,
          fontWeight: 300,
          lineHeight: 1,
          transition: "transform 0.12s ease, box-shadow 0.12s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.4)";
        }}
      >
        +
      </button>

      {/* ── Corkboard surface ────────────────────────────────────────────── */}
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
            { label: "ACT I",   left: 48,   top: 60 },
            { label: "ACT II",  left: 520,  top: 60 },
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

        {/* Scene cards */}
        {loaded &&
          cards.map((card) => (
            <SceneCard
              key={card.id}
              card={card}
              onMove={handleMove}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
      </div>

      {/* ── Add Scene Modal ──────────────────────────────────────────────── */}
      {showModal && (
        <AddSceneModal
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
