"use client";

import React from "react";
import { Icon } from "../Icon";

/* ==========================================================================
   Checkout primitives — Field, Switch, Check, Logo, Visa glyph.
   Ported 1:1 from the source checkout app.
   ========================================================================== */

export interface FieldProps {
  label?: string;
  req?: boolean;
  opt?: boolean;
  hint?: React.ReactNode;
  children: React.ReactNode;
}

export function Field({ label, req, opt, hint, children }: FieldProps) {
  return (
    <div className="field">
      {label && (
        <label className="lbl">
          {label}
          {req && <span className="req">*</span>}
          {opt && <span className="opt"> (optional)</span>}
        </label>
      )}
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ checked, onChange }: SwitchProps) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="track" />
      <span className="knob" />
    </label>
  );
}

export interface CheckProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}

export function Check({ checked, onChange, children }: CheckProps) {
  return (
    <label className="check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="box">
        <Icon name="check" size={14} strokeWidth={3} />
      </span>
      <span className="txt">{children}</span>
    </label>
  );
}

/** Stacked wordmark lockup. Asset lives in /public/assets. */
export function Logo() {
  return (
    <div className="brandmark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/breakaway-full-logo.png" alt="Breakaway Pickleball" />
    </div>
  );
}

/** Inline Visa glyph used in the card input + saved-card row. */
export function Visa() {
  return (
    <svg viewBox="0 0 48 32" fill="none">
      <rect width="48" height="32" rx="4" fill="#fff" stroke="#e5e7eb" />
      <path
        d="M20.6 21h-2.3l1.5-9h2.3l-1.5 9Zm8.6-8.8c-.5-.2-1.2-.4-2.1-.4-2.3 0-4 1.2-4 3 0 1.3 1.2 2 2.1 2.4.9.4 1.2.7 1.2 1 0 .6-.7.8-1.3.8-.9 0-1.4-.1-2.1-.4l-.3-.2-.3 1.9c.5.2 1.5.4 2.5.4 2.5 0 4.1-1.2 4.1-3.1 0-1-.6-1.8-2-2.4-.8-.4-1.3-.6-1.3-1 0-.4.4-.7 1.3-.7.7 0 1.3.1 1.7.3l.2.1.3-1.7Zm5.9-.2h-1.8c-.5 0-1 .2-1.2.7l-3.4 8.3h2.5l.5-1.4h3l.3 1.4h2.2l-1.9-9Zm-2.9 5.8.9-2.5.5 2.5h-1.4Zm-15.8-5.8L13.7 18l-.3-1.2c-.5-1.5-1.8-3-3.3-3.8l2.2 7h2.5l3.8-9h-2.5Z"
        fill="#124A7A"
      />
      <path
        d="M11.4 12.2H7.6l-.1.2c3 .7 5 2.5 5.8 4.6l-.8-4.1c-.1-.5-.5-.7-1.1-.7Z"
        fill="#90D123"
      />
    </svg>
  );
}
