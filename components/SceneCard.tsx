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
  onUpdate?: (id: string, fields: Partial<Pick<SceneCardData, "title" | "description">>) => void;
}

export default function SceneCard({ card, onMove, onDelete, onUpdate }: Props) {
  const [pos, setPos]           = useState({ x: card.x, y: card.y });
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered]   = useState(false);

  // Track which field is being edited: null | "title" | "description"
  const [editing, setEditing] = useState<"title" | "description" | null>(null);

  const dragOrigin = useRef<{
    ptrX: number;
    ptrY: number;
    cardX: number;
    cardY: number;
  } | null>(null);

  // Track whether the pointer actually moved (to distinguish click from drag)
  const didMove = useRef(false);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef  = useRef<HTMLParagraphElement>(null);

  // Sync position if parent updates the card data (e.g. initial load)
  useEffect(() => {
    setPos({ x: card.x, y: card.y });
  }, [card.x, card.y]);

  // When editing starts, focus the element and place cursor at end
  useEffect(() => {
    if (editing === "title" && titleRef.current) {
      const el = titleRef.current;
      el.focus();
      // Place caret at end
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    } else if (editing === "description" && descRef.current) {
      const el = descRef.current;
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [editing]);

  // Commit a field value on blur
  const commitEdit = useCallback(
    (field: "title" | "description", el: HTMLElement) => {
      const value = el.innerText.trim();
      // Restore original if empty
      if (!value) {
        el.innerText = field === "title" ? card.title : card.description;
      } else if (value !== (field === "title" ? card.title : card.description)) {
        onUpdate?.(card.id, { [field]: value });
      }
      setEditing(null);
    },
    [card.id, card.title, card.description, onUpdate]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // If already editing a field, let pointer events pass to that field
      if (editing) return;
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
    [pos, editing]
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
        cursor: dragging ? "grabbing" : editing ? "default" : "grab",
        filter: shadow,
        transition: dragging ? "none" : "filter 0.15s ease",
        zIndex: dragging ? 100 : editing ? 50 : hovered ? 10 : 1,
        userSelect: editing ? "text" : "none",
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
      {onDelete && hovered && !dragging && !editing && (
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
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
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

      {/* Title — Caveat handwritten font, double-click to edit */}
      <h3
        ref={titleRef}
        contentEditable={editing === "title"}
        suppressContentEditableWarning
        onDoubleClick={(e) => {
          e.stopPropagation();
          setEditing("title");
        }}
        onPointerDown={(e) => {
          // If already editing this field, let browser handle selection
          if (editing === "title") {
            e.stopPropagation();
            return;
          }
          // Otherwise let the card's drag handler take over (do nothing special)
        }}
        onBlur={(e) => {
          if (editing === "title") commitEdit("title", e.currentTarget);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
          if (e.key === "Escape") {
            // Restore original and cancel
            e.currentTarget.innerText = card.title;
            setEditing(null);
          }
        }}
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#1f2937",
          lineHeight: 1.25,
          marginBottom: 8,
          marginTop: 0,
          outline: editing === "title" ? "2px dashed rgba(0,0,0,0.25)" : "none",
          outlineOffset: 2,
          borderRadius: 2,
          cursor: editing === "title" ? "text" : "inherit",
          minHeight: "1.5em",
          wordBreak: "break-word",
        }}
      >
        {card.title}
      </h3>

      {/* Description — Caveat handwritten font, double-click to edit */}
      <p
        ref={descRef}
        contentEditable={editing === "description"}
        suppressContentEditableWarning
        onDoubleClick={(e) => {
          e.stopPropagation();
          setEditing("description");
        }}
        onPointerDown={(e) => {
          if (editing === "description") {
            e.stopPropagation();
            return;
          }
        }}
        onBlur={(e) => {
          if (editing === "description") commitEdit("description", e.currentTarget);
        }}
        onKeyDown={(e) => {
          // Shift+Enter or Ctrl+Enter commits; plain Escape cancels
          if ((e.key === "Enter" && (e.shiftKey || e.ctrlKey)) || e.key === "Escape") {
            if (e.key === "Escape") {
              e.currentTarget.innerText = card.description;
              setEditing(null);
            } else {
              e.currentTarget.blur();
            }
            e.preventDefault();
          }
        }}
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "1rem",
          color: "#4b5563",
          lineHeight: 1.4,
          margin: 0,
          outline: editing === "description" ? "2px dashed rgba(0,0,0,0.25)" : "none",
          outlineOffset: 2,
          borderRadius: 2,
          cursor: editing === "description" ? "text" : "inherit",
          minHeight: "1.2em",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        {card.description}
      </p>

      {/* Edit hint — shown on hover when not dragging */}
      {hovered && !dragging && !editing && (
        <div
          style={{
            position: "absolute",
            bottom: 4,
            right: 6,
            fontSize: 8,
            color: "rgba(0,0,0,0.3)",
            fontFamily: "'Lato', sans-serif",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          dbl-click to edit
        </div>
      )}
    </div>
  );
}
