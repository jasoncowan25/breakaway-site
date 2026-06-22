"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";
import { Field } from "./primitives";
import { AccountInline } from "./AccountTask";
import type { Player } from "../../lib/types";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

const TEE_ADULT = ["XS", "S", "M", "L", "XL", "XXL"];
const TEE_YOUTH = ["Youth S", "Youth M", "Youth L"];

function TeeSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select className={"inp" + (value ? "" : " placeholder")} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>
        Select size
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/* ==========================================================================
   PlayerCard + YouCard — a single registrant row in the checkout.
   Ported 1:1 from the source checkout app (entering/leaving animations,
   adult vs. child framing, the collapsed logged-in "you" card).
   ========================================================================== */

export interface PlayerCardProps {
  p: Player;
  idx: number;
  isYou: boolean;
  multi: boolean;
  kidsMode: boolean;
  tshirts: boolean;
  prefill: boolean;
  entering: boolean;
  leaving: boolean;
  onChange: (patch: Partial<Player>) => void;
  onEmailBlur?: (email: string) => void;
  onRemove: (() => void) | null;
}

export function PlayerCard({
  p,
  idx,
  isYou,
  multi,
  kidsMode,
  tshirts,
  prefill,
  entering,
  leaving,
  onChange,
  onEmailBlur,
  onRemove,
}: PlayerCardProps) {
  const child = kidsMode;
  const initial = (p.first || (isYou ? "Y" : "G")).trim().charAt(0).toUpperCase();
  const [committedEmail, setCommittedEmail] = useState(p.email);
  const firstValid = p.first.trim().length > 0;
  const lastValid = p.last.trim().length > 0;
  const validEmailLive = isValidEmail(p.email);
  const emailError =
    !validEmailLive && committedEmail.trim().length > 0 && !isValidEmail(committedEmail);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!p.email) setCommittedEmail("");
  }, [p.email]);
  const commitEmail = useCallback(
    (email: string) => {
      setCommittedEmail(email);
      onEmailBlur?.(email);
    },
    [onEmailBlur],
  );
  useEffect(() => {
    const input = emailInputRef.current;
    if (!input) return;
    const handleBlur = () => commitEmail(input.value);
    input.addEventListener("blur", handleBlur);
    input.addEventListener("focusout", handleBlur);
    return () => {
      input.removeEventListener("blur", handleBlur);
      input.removeEventListener("focusout", handleBlur);
    };
  }, [commitEmail]);
  const fph = isYou ? "Jordan" : child ? "Sam" : "Taylor";
  const lph = isYou ? "Lee" : child ? "Lee" : "Rivera";
  return (
    <div
      className={
        "player-card" +
        (isYou ? " is-you" : "") +
        (child ? " is-child" : "") +
        (entering ? " entering" : "") +
        (leaving ? " leaving" : "")
      }
    >
      <div className="player-card-top">
        <span className="av">{child ? "★" : initial}</span>
        <span className="who">
          {isYou ? "Your details" : child ? `Child ${idx + 1}` : `Player ${idx + 1}`}
        </span>
        {isYou && multi && <span className="youtag">YOU</span>}
        {onRemove && (
          <button className="remove" type="button" onClick={onRemove} aria-label="Remove">
            <Icon name="x" size={16} />
          </button>
        )}
      </div>

      <div className="field-row">
        <Field label="First name" req>
          <div className="inp-wrap">
            <input
              className={"inp" + (isYou && prefill ? " prefilled" : "")}
              type="text"
              placeholder={fph}
              value={p.first}
              onChange={(e) => onChange({ first: e.target.value })}
            />
            {firstValid && (
              <span className="valid-check" aria-label="Looks good">
                <Icon name="check" size={13} strokeWidth={3} />
              </span>
            )}
          </div>
        </Field>
        <Field label="Last name" req>
          <div className="inp-wrap">
            <input
              className={"inp" + (isYou && prefill ? " prefilled" : "")}
              type="text"
              placeholder={lph}
              value={p.last}
              onChange={(e) => onChange({ last: e.target.value })}
            />
            {lastValid && (
              <span className="valid-check" aria-label="Looks good">
                <Icon name="check" size={13} strokeWidth={3} />
              </span>
            )}
          </div>
        </Field>
      </div>

      {child ? (
        <>
          <div className="field-row">
            <Field label="Age at camp" req hint="Players are grouped by age & level.">
              <input
                className="inp"
                type="number"
                min="8"
                max="16"
                placeholder="12"
                value={p.age || ""}
                onChange={(e) => onChange({ age: e.target.value })}
              />
            </Field>
            {tshirts ? (
              <Field label="T-shirt size" req>
                <TeeSelect value={p.tee} options={TEE_YOUTH} onChange={(tee) => onChange({ tee })} />
              </Field>
            ) : (
              <div />
            )}
          </div>
          <div className="child-note">
            <Icon name="shield" size={15} />
            Updates for this child go to the parent / guardian below.
          </div>
        </>
      ) : (
        <>
          {tshirts && (
            <Field label="T-shirt size" req hint="Every player gets a Breakaway camp tee.">
              <TeeSelect value={p.tee} options={TEE_ADULT} onChange={(tee) => onChange({ tee })} />
            </Field>
          )}
          <Field label="Email" req>
            <div className={"email-acct" + (emailError ? " invalid" : "")}>
              <div className="inp-wrap flush">
                <span className="lead">
                  <Icon name="mail" size={17} />
                </span>
                <input
                  ref={emailInputRef}
                  className={"inp flush" + (isYou && prefill ? " prefilled" : "")}
                  type="email"
                  aria-invalid={emailError || undefined}
                  placeholder={isYou ? "you@example.com" : "player@example.com"}
                  value={p.email}
                  onChange={(e) => {
                    onChange({ email: e.currentTarget.value });
                  }}
                  onBlurCapture={(e) => {
                    commitEmail(e.currentTarget.value);
                  }}
                  onBlur={(e) => {
                    commitEmail(e.currentTarget.value);
                  }}
                />
                {validEmailLive && <span className="valid-check" aria-label="Valid email">
                  <Icon name="check" size={13} strokeWidth={3} />
                </span>}
              </div>
              <AccountInline email={committedEmail} first={p.first} isYou={isYou} />
            </div>
            {emailError && (
              <span className="field-error" role="alert">
                Enter a valid email address.
              </span>
            )}
          </Field>
        </>
      )}
    </div>
  );
}

export interface YouCardProps {
  p: Player;
  multi: boolean;
  tshirts: boolean;
  onChange: (patch: Partial<Player>) => void;
}

/** Collapsed "you" card shown when logged in and player 1 is the account holder. */
export function YouCard({ p, multi, tshirts, onChange }: YouCardProps) {
  const [editing, setEditing] = useState(false);
  const initial = (p.first || "Y").trim().charAt(0).toUpperCase();
  if (editing) {
    return (
      <div className="player-card is-you">
        <div className="player-card-top">
          <span className="av">{initial}</span>
          <span className="who">Your details</span>
          <span className="youtag">YOU</span>
        </div>
        <div className="field-row">
          <Field label="First name" req>
            <input
              className="inp"
              type="text"
              placeholder="Jordan"
              value={p.first}
              onChange={(e) => onChange({ first: e.target.value })}
            />
          </Field>
          <Field label="Last name" req>
            <input
              className="inp"
              type="text"
              placeholder="Lee"
              value={p.last}
              onChange={(e) => onChange({ last: e.target.value })}
            />
          </Field>
        </div>
        {tshirts && (
          <Field label="T-shirt size" req hint="Every player gets a Breakaway camp tee.">
            <TeeSelect value={p.tee} options={TEE_ADULT} onChange={(tee) => onChange({ tee })} />
          </Field>
        )}
        <button type="button" className="editor-done" onClick={() => setEditing(false)}>
          Done
        </button>
      </div>
    );
  }
  return (
    <div className="you-confirmed">
      <span className="av">{initial}</span>
      <span className="yc-txt">
        <span className="yc-h">
          {(p.first + " " + p.last).trim() || "You"}
          <span className="youtag">YOU</span>
        </span>
        <span className="yc-p">
          {multi
            ? "You're on the court — playing under your account."
            : "You're on the court — already set from your account."}
        </span>
        {tshirts && (
          <span className="yc-tee">
            <span className="yc-tee-lbl">
              T-shirt size<span className="req">*</span>
            </span>
            <TeeSelect value={p.tee} options={TEE_ADULT} onChange={(tee) => onChange({ tee })} />
          </span>
        )}
      </span>
      <button type="button" className="yc-edit" onClick={() => setEditing(true)}>
        Edit
      </button>
    </div>
  );
}
