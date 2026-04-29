"use client";

import { useState, useCallback } from "react";
import Corkboard from "@/components/Corkboard";

export default function Home() {
  const [sceneCount, setSceneCount] = useState<number | null>(null);

  const handleScenesChange = useCallback((count: number) => {
    setSceneCount(count);
  }, []);

  return (
    <>
      {/* Toolbar */}
      <header
        style={{
          background: "linear-gradient(180deg, #3d2b1f 0%, #2c1e14 100%)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          height: 52,
          gap: 16,
          flexShrink: 0,
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="5" width="18" height="13" rx="1.5" fill="#e8b84b" stroke="#c49a2a" strokeWidth="1" />
            <rect x="7" y="9" width="18" height="13" rx="1.5" fill="#fef3a0" stroke="#c49a2a" strokeWidth="1" />
            <circle cx="16" cy="8" r="2.5" fill="#d44f4f" />
            <circle cx="16" cy="8" r="1.2" fill="#b03030" />
          </svg>
          <span
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 22,
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.01em",
            }}
          >
            Story Map
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} />

        {/* Story title */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          <span>Untitled Story</span>
        </div>

        {/* Add Scene button */}
        <AddSceneToolbarButton />

        {/* Scene count + act badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
          {sceneCount !== null && (
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
              {sceneCount} {sceneCount === 1 ? "scene" : "scenes"}
            </span>
          )}
          <span
            style={{
              background: "#d4873a",
              color: "white",
              fontSize: 10,
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: 9999,
              letterSpacing: "0.05em",
            }}
          >
            ACT 1–3
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} />

        {/* Fit button (decorative) */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
          <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Fit
        </div>
      </header>

      {/* Corkboard — fills remaining viewport height */}
      <main style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <Corkboard onScenesChange={handleScenesChange} />
      </main>
    </>
  );
}

/**
 * The toolbar "Add Scene" button.
 * It dispatches a custom event that Corkboard listens to — this keeps the
 * toolbar decoupled from the Corkboard without needing a global store.
 * NOTE: The floating "+" FAB on the board also works; this toolbar button
 * triggers the same modal via a CustomEvent.
 */
function AddSceneToolbarButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("story-map:open-add"))}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(255,255,255,0.1)",
        border: "none",
        borderRadius: 6,
        color: "white",
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "'Lato', sans-serif",
        padding: "6px 12px",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.2)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)")}
    >
      <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
      Add Scene
    </button>
  );
}
