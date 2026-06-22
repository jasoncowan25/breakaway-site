"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";
import { Field, Check } from "./primitives";
import { formatPhone } from "../../lib/format";
import type { Guardian as GuardianModel } from "../../lib/types";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/* ==========================================================================
   Guardian block — shown in kids mode. The non-playing adult registering
   one or more children. Ported 1:1 from the source checkout app.
   ========================================================================== */

export interface GuardianProps {
  g: GuardianModel;
  childCount: number;
  prefill: boolean;
  onChange: (patch: Partial<GuardianModel>) => void;
  onEmailBlur?: (email: string) => void;
}

export function Guardian({
  g,
  childCount,
  prefill,
  onChange,
  onEmailBlur,
}: GuardianProps) {
  const kids = childCount > 1 ? "children" : "child";
  const pf = prefill ? " prefilled" : "";
  const [committedEmail, setCommittedEmail] = useState(g.email);
  const firstValid = g.first.trim().length > 0;
  const lastValid = g.last.trim().length > 0;
  const validEmailLive = isValidEmail(g.email);
  const emailError =
    !validEmailLive && committedEmail.trim().length > 0 && !isValidEmail(committedEmail);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!g.email) setCommittedEmail("");
  }, [g.email]);
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
  return (
    <div className="guardian view">
      <div className="field-row">
        <Field label="First name" req>
          <div className="inp-wrap">
            <input
              className={"inp" + pf}
              type="text"
              placeholder="Alex"
              value={g.first}
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
              className={"inp" + pf}
              type="text"
              placeholder="Lee"
              value={g.last}
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
      <Field label="Cell phone" req>
        <div className="inp-wrap">
          <span className="lead">
            <Icon name="phone" size={16} />
          </span>
          <input
            className="inp"
            type="tel"
            placeholder="(416) 555-0142"
            value={g.phone}
            onChange={(e) => onChange({ phone: formatPhone(e.target.value) })}
            maxLength={14}
          />
        </div>
      </Field>
      <Field label="Email" req>
        <div className={"inp-wrap" + (emailError ? " invalid" : "")}>
          <span className="lead">
            <Icon name="mail" size={16} />
          </span>
          <input
            ref={emailInputRef}
            className={"inp" + pf}
            type="email"
            aria-invalid={emailError || undefined}
            placeholder="parent@example.com"
            value={g.email}
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
        {emailError && (
          <span className="field-error" role="alert">
            Enter a valid email address.
          </span>
        )}
      </Field>
      <div className="consents">
        <Check checked={g.authorized} onChange={(v) => onChange({ authorized: v })}>
          <b>Authorization.</b> I&apos;m the parent or legal guardian and I authorize my{" "}
          {kids}&apos;s participation in this camp.
        </Check>
      </div>
    </div>
  );
}
