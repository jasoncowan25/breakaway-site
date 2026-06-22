"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Icon } from "../Icon";
import { Field } from "./primitives";
import { AccountInline } from "./AccountTask";
import type { Player } from "../../lib/types";
import { nextTeeOptionIndex, teeOptionIndex } from "../../lib/tee-select";

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
  const listId = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => teeOptionIndex(value, options));
  const selectedIndex = teeOptionIndex(value, options);
  const resolvedActiveIndex = activeIndex >= 0 ? activeIndex : selectedIndex;

  const openList = useCallback(() => {
    setOpen(true);
    setActiveIndex((current) => {
      if (current >= 0) return current;
      if (selectedIndex >= 0) return selectedIndex;
      return options.length > 0 ? 0 : -1;
    });
  }, [options.length, selectedIndex]);

  const closeList = useCallback(() => {
    setOpen(false);
  }, []);

  const selectOption = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option) return;
      onChange(option);
      setActiveIndex(index);
      setOpen(false);
      requestAnimationFrame(() => buttonRef.current?.focus());
    },
    [onChange, options],
  );

  useEffect(() => {
    if (!open) setActiveIndex(selectedIndex);
  }, [open, selectedIndex]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) =>
        nextTeeOptionIndex(event.key, current >= 0 ? current : selectedIndex, options),
      );
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        openList();
        return;
      }
      selectOption(resolvedActiveIndex >= 0 ? resolvedActiveIndex : 0);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeList();
    }
  };

  return (
    <div
      className={"tee-select" + (open ? " open" : "")}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;
        if (!nextTarget || !event.currentTarget.contains(nextTarget)) closeList();
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={"inp tee-combobox" + (value ? "" : " placeholder")}
        role="combobox"
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-activedescendant={
          open && resolvedActiveIndex >= 0 ? `${listId}-${resolvedActiveIndex}` : undefined
        }
        onFocus={openList}
        onClick={() => {
          if (open) closeList();
          else openList();
        }}
        onKeyDown={handleKeyDown}
      >
        <span className={value ? "tee-value" : "tee-placeholder"}>{value || "Select size"}</span>
        <span className="tee-caret" aria-hidden="true" />
      </button>
      {open && (
        <div className="tee-list" id={listId} role="listbox" aria-label="T-shirt size">
          {options.map((option, index) => (
            <button
              key={option}
              id={`${listId}-${index}`}
              type="button"
              className={"tee-option" + (index === resolvedActiveIndex ? " active" : "")}
              role="option"
              aria-selected={option === value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectOption(index)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
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
