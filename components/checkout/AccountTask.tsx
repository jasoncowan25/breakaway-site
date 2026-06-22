"use client";

import React, { useState } from "react";
import { Icon, type IconName } from "../Icon";
import { Switch } from "./primitives";

/* ==========================================================================
   AccountOptIn — the "save it to your Breakaway account" switch row,
   shown on checkout when the user is NOT logged in.
   ========================================================================== */

export interface AccountOptInProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  email: string;
}

export function AccountOptIn({ checked, onChange, email }: AccountOptInProps) {
  const recipient = email.trim();

  return (
    <label className={"account-optin" + (checked ? " on" : "")}>
      <span className="ico brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/breakaway-monogram.png" alt="Breakaway" />
      </span>
      <span className="acc-copy">
        <span className="acc-h">Save it all to your Breakaway account</span>
        <span className="acc-p">
          Camp details &amp; photos in one place. We&apos;ll email{" "}
          <b>{recipient || "the address above"}</b> a one-tap magic link — no password.
        </span>
      </span>
      <Switch checked={checked} onChange={onChange} />
    </label>
  );
}

export interface AccountInlineProps {
  email: string;
  first: string;
  isYou: boolean;
  guardian?: boolean;
}

export function AccountInline({ email, first, isYou }: AccountInlineProps) {
  const recipient = email.trim();
  const name = first.trim();
  const title = isYou
    ? "My Breakaway account included"
    : name
      ? `Sets up ${name}'s account`
      : "Sets up their account";
  const copy = isYou
    ? (
      <>
        Camp details and game plan in one place. We&apos;ll email a one-tap magic
        link to <b>{recipient || "this address"}</b> — no password.
      </>
    )
    : (
      <>
        We&apos;ll email a one-tap magic link to <b>{recipient || "this address"}</b>{" "}
        so they can manage their own camp details and photos — no password.
      </>
    );

  return (
    <div className="acct-attach">
      <span className="ai-ic">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/breakaway-monogram.png" alt="Breakaway" />
      </span>
      <span className="ai-copy">
        <span className="ai-h">{title}</span>
        <span className="ai-p">{copy}</span>
      </span>
    </div>
  );
}

/* ==========================================================================
   AccountTask — an expandable optional onboarding task on the success card
   (e.g. add dietary needs, pick a shot to work on). Ported 1:1.
   ========================================================================== */

export interface AccountTaskProps {
  icon: IconName;
  title: string;
  sub: string;
  type?: "text" | "select";
  options?: string[];
  placeholder?: string;
}

export function AccountTask({
  icon,
  title,
  sub,
  type,
  options = [],
  placeholder,
}: AccountTaskProps) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState("");
  const [saved, setSaved] = useState("");
  const commit = () => {
    if (!val.trim()) return;
    setSaved(val.trim());
    setOpen(false);
  };
  return (
    <div className={"ac-task" + (saved ? " done" : "") + (open ? " open" : "")}>
      <button type="button" className="ac-task-row" onClick={() => setOpen((o) => !o)}>
        <span className="t-ic">
          {saved ? <Icon name="check" size={16} strokeWidth={3} /> : <Icon name={icon} size={16} />}
        </span>
        <span className="t-copy">
          <span className="t-h">{title}</span>
          <span className="t-p">{saved || sub}</span>
        </span>
        <span className="t-act">{saved ? "Edit" : "Add"}</span>
      </button>
      {open && (
        <div className="t-panel">
          {type === "select" ? (
            <select
              className="t-input"
              value={val}
              onChange={(e) => setVal(e.target.value)}
            >
              <option value="">Choose a focus…</option>
              {options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="t-input"
              placeholder={placeholder}
              value={val}
              onChange={(e) => setVal(e.target.value)}
            />
          )}
          <button type="button" className="t-save" disabled={!val.trim()} onClick={commit}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}
