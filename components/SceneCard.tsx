"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CardColor = "yellow" | "blue" | "green" | "pink" | "peach" | "lavender";
export type PinStyle = "pin" | "tape";

export interface SceneCardData {
  id: string;
  title: string;
  description: string;
  sceneNumber: number;
  label: string;
  color: CardColor;
  pinStyle: PinStyle;
  pinColor?: string;
  rotation: number; // degrees
  x: number;
  y: number;
}

// Exact colors from the design mockup
const COLOR_MAP: Record<CardColor, string> = {
  yellow:   "#fef3a0",
  blue:     "#c5dff8",
  green:    "#c8f0c0",
  pink:     "#f9d0d0",
  peach:    "#fddbb8",
  lavender: "#ddd0f7",
};

interface Props {
  card: SceneCardData;
  onMove: (id: string, x: number, y: number) => void;
  onDelete?: (id: string) => void;
}

export default function SceneCard({ card, onMove, onDelete }: Props) {
  const [pos, setPos]         = useState({ x: card.x, y: card.y });
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const dragOrigin = useRef<{
    ptrX: number;
    ptrY: number;
    cardX: number;
    cardY: number;
  } | null>(null);

  // Track whether the pointer actually moved (to distinguish click from drag)
  const didMove = useRef(false);

  // Sync position if parent updates the card data (e.g. initial load)
  useEffect(() => {
    setPos({ x: card.x, y: card.y });
  }, [card.x, card.y]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      didMove.current = false;
      dragOrigin.current = {
        ptrX: e.clientX,
        ptrY: e.clientY,
        cardX: pos.x,
        cardY: pos.y,
      };
      setDragging(true);
    },
    [pos]
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragOrigin.current) return;
    const dx = e.clientX - dragOrigin.current.ptrX;
    const dy = e.clientY - dragOrigin.current.ptrY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didMove.current = true;
    setPos({ x: dragOrigin.current.cardX + dx, y: dragOrigin.current.cardY + dy });
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragOrigin.current) return;
      e.currentTarget.releasePointerCapture(e.pointerId);
      const dx = e.clientX - dragOrigin.current.ptrX;
      const dy = e.clientY - dragOrigin.current.ptrY;
      const finalX = dragOrigin.current.cardX + dx;
      const finalY = dragOrigin.current.cardY + dy;
      dragOrigin.current = null;
      setDragging(false);
      onMove(card.id, finalX, finalY);
    },
    [card.id, onMove]
  );

  const shadow = dragging
    ? "drop-shadow(6px 12px 20px rgba(0,0,0,0.45))"
    : hovered
    ? "drop-shadow(4px 8px 16px rgba(0,0,0,0.4))"
    : "drop-shadow(2px 4px 8px rgba(0,0,0,0.3))";

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: 192,
        transform: `rotate(${card.rotation}deg)`,
        backgroundColor: COLOR_MAP[card.color],
        padding: "18px 14px 14px",
        borderRadius: 2,
        cursor: dragging ? "grabbing" : "grab",
        filter: shadow,
        transition: dragging ? "none" : "filter 0.15s ease",
        zIndex: dragging ? 100 : hovered ? 10 : 1,
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {/* Pin or tape fastener */}
      {card.pinStyle === "pin" ? (
        <div
          style={{
            position: "absolute",
            top: -10,
            left: "50%",
            width: 18,
            height: 18,
            borderRadius: "50% 50% 50% 0",
            backgroundColor: card.pinColor ?? "#c0392b",
            transform: "translateX(-50%) rotate(-45deg)",
            zIndex: 2,
            boxShadow: "1px 1px 3px rgba(0,0,0,0.4)",
          }}
        >
          {/* Pin highlight */}
          <div
            style={{
              position: "absolute",
              top: 4,
              left: 4,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.4)",
            }}
          />
        </div>
      ) : (
        /* Tape */
        <div
          style={{
            position: "absolute",
            top: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 18,
            background: "rgba(255,230,150,0.6)",
            borderRadius: 2,
            boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
            zIndex: 2,
          }}
        />
      )}

      {/* Delete button — visible on hover, positioned top-right */}
      {onDelete && hovered && !dragging && (
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id);
          }}
          aria-label="Delete scene"
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.18)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(0,0,0,0.6)",
            fontSize: 13,
            lineHeight: 1,
            zIndex: 20,
            padding: 0,
          }}
        >
          ×
        </button>
      )}

      {/* Header: scene number + label */}
      <div
        style={{
          marginBottom: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.12)",
            fontSize: 11,
            fontWeight: 700,
            lineHeight: "20px",
            textAlign: "center",
            color: "rgba(0,0,0,0.5)",
            fontFamily: "'Lato', sans-serif",
          }}
        >
          {card.sceneNumber}
        </span>
        <span
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 9,
            color: "#999",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          {card.label}
        </span>
      </div>

      {/* Title — Caveat handwritten font */}
      <h3
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#1f2937",
          lineHeight: 1.25,
          marginBottom: 8,
          marginTop: 0,
        }}
      >
        {card.title}
      </h3>

      {/* Description — Caveat handwritten font */}
      <p
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "1rem",
          color: "#4b5563",
          lineHeight: 1.4,
          margin: 0,
        }}
      >
        {card.description}
      </p>
    </div>
  );
}
