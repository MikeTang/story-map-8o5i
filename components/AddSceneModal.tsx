"use client";

import { useEffect, useRef, useState } from "react";
import { CardColor, PinStyle } from "./SceneCard";

interface Props {
  onAdd: (title: string, description: string, color: CardColor) => void;
  onClose: () => void;
}

const COLORS: { value: CardColor; bg: string; label: string }[] = [
  { value: "yellow",   bg: "#fef3a0", label: "Yellow"   },
  { value: "blue",     bg: "#c5dff8", label: "Blue"     },
  { value: "green",    bg: "#c8f0c0", label: "Green"    },
  { value: "pink",     bg: "#f9d0d0", label: "Pink"     },
  { value: "peach",    bg: "#fddbb8", label: "Peach"    },
  { value: "lavender", bg: "#ddd0f7", label: "Lavender" },
];

export default function AddSceneModal({ onAdd, onClose }: Props) {
  const [title, setTitle]           = useState("");
  const [description, setDesc]      = useState("");
  const [color, setColor]           = useState<CardColor>("yellow");
  const titleRef                    = useRef<HTMLInputElement>(null);

  // Auto-focus title on open
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    onAdd(t, description.trim(), color);
    onClose();
  }

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Dialog — stop propagation so clicks inside don't close */}
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          background: "#fef9ec",
          borderLeft: "4px solid #e8b84b",
          borderRadius: 4,
          padding: "28px 28px 22px",
          width: 340,
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 22,
              fontWeight: 700,
              color: "#3d2b1f",
            }}
          >
            New Scene
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#888",
              fontSize: 20,
              lineHeight: 1,
              padding: "2px 4px",
            }}
          >
            ×
          </button>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label
            htmlFor="scene-title"
            style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.06em" }}
          >
            TITLE
          </label>
          <input
            id="scene-title"
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Scene title…"
            maxLength={80}
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 18,
              border: "none",
              borderBottom: "2px solid #e8b84b",
              background: "transparent",
              outline: "none",
              padding: "4px 0",
              color: "#1f2937",
            }}
          />
        </div>

        {/* Description */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label
            htmlFor="scene-desc"
            style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.06em" }}
          >
            DESCRIPTION
          </label>
          <textarea
            id="scene-desc"
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="What happens in this scene…"
            rows={3}
            maxLength={300}
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 16,
              border: "none",
              borderBottom: "2px solid #e8b84b",
              background: "transparent",
              outline: "none",
              padding: "4px 0",
              color: "#374151",
              resize: "none",
            }}
          />
        </div>

        {/* Color picker */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.06em" }}>
            CARD COLOR
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                aria-label={c.label}
                onClick={() => setColor(c.value)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: c.bg,
                  border: color === c.value ? "2px solid #3d2b1f" : "2px solid rgba(0,0,0,0.15)",
                  cursor: "pointer",
                  boxShadow: color === c.value ? "0 0 0 2px #e8b84b" : "none",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#888",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 12px",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "white",
              background: title.trim() ? "#d4873a" : "#c0a080",
              border: "none",
              borderRadius: 6,
              cursor: title.trim() ? "pointer" : "default",
              padding: "6px 18px",
              transition: "background 0.15s",
            }}
          >
            Add Scene
          </button>
        </div>
      </form>
    </div>
  );
}
