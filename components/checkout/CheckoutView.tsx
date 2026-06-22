"use client";

import React, { useState } from "react";
import { Icon } from "../Icon";
import { Field, Visa } from "./primitives";
import { PlayerCard, YouCard } from "./PlayerCard";
import { Guardian } from "./Guardian";
import { money } from "../../lib/format";
import { checkoutAmount } from "../../lib/checkout-amount";
import type { Account, Agreements, Camp, Guardian as GuardianModel, Player } from "../../lib/types";

/* ==========================================================================
   CheckoutView — Checkout v3: inline account creation under each email,
   one details step, then a revealed payment step with the final Book CTA.
   ========================================================================== */

export interface CheckoutViewProps {
  camp: Camp;
  kidsMode: boolean;
  players: Player[];
  guardian: GuardianModel;
  showGuardian: boolean;
  prefill: boolean;
  acct: Account;
  savedCardOpen: boolean;
  subtotal: number;
  agree: Agreements;
  entering: string[];
  leaving: string[];
  updatePlayer: (i: number, patch: Partial<Player>) => void;
  addPlayer: () => void;
  removePlayer: (i: number) => void;
  setGuardian: (updater: (g: GuardianModel) => GuardianModel) => void;
  setSavedCardOpen: (v: boolean) => void;
  setAgree: (updater: (a: Agreements) => Agreements) => void;
  onContinuePayment?: () => Promise<boolean> | boolean;
  onEditDetails?: () => void;
  onPay: () => void;
  paymentContent?: React.ReactNode;
  checkoutError?: React.ReactNode;
  continuePaymentLabel?: React.ReactNode;
  continuePaymentDisabled?: boolean;
  payButtonLabel?: React.ReactNode;
  payButtonDisabled?: boolean;
}

function looksLikeEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

interface DetailsSummaryProps {
  kidsMode: boolean;
  players: Player[];
  guardian: GuardianModel;
  showGuardian: boolean;
  collectTshirtSizes: boolean;
  prefill: boolean;
  acct: Account;
}

function DetailsSummary({
  kidsMode,
  players,
  guardian,
  showGuardian,
  collectTshirtSizes,
  prefill,
  acct,
}: DetailsSummaryProps) {
  const acctLine = kidsMode
    ? "Confirmation and camp updates sent to the parent / guardian"
    : prefill
      ? `${acct.first} ${acct.last} · ${acct.email}`
      : "My Breakaway account included for every player";

  const accountLabel = kidsMode ? "Updates" : "Account";

  const playerSub = (p: Player) => {
    const pieces = kidsMode ? [p.age ? `Age ${p.age}` : null] : [p.email || null];
    if (collectTshirtSizes && p.tee) pieces.push(`Tee ${p.tee}`);
    return pieces.filter(Boolean).join(" · ");
  };

  const accountLine = prefill && !kidsMode
    ? `${acct.first} ${acct.last} · ${acct.email}`
    : acctLine;

  return (
    <div className="details-summary">
      <div className="ds-group">
        <span className="ds-k">
          {kidsMode ? "Campers" : players.length > 1 ? "Players" : "Player"}
        </span>
        <div className="ds-list">
          {players.map((p, i) => {
            const name =
              (p.first + " " + p.last).trim() ||
              (kidsMode ? `Child ${i + 1}` : `Player ${i + 1}`);
            const sub = playerSub(p);
            const isYou = !kidsMode && i === 0;
            return (
              <div className="ds-row" key={p.id}>
                <span className="ds-av">
                  {(p.first || (isYou ? "Y" : "?")).charAt(0).toUpperCase()}
                </span>
                <span className="ds-person">
                  <span className="ds-name">
                    {name}
                    {isYou && <span className="ds-you"> · You</span>}
                  </span>
                  {sub && <span className="ds-sub">{sub}</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {showGuardian && (
        <div className="ds-group">
          <span className="ds-k">Guardian</span>
          <div className="ds-row">
            <span className="ds-av">{(guardian.first || "G").charAt(0).toUpperCase()}</span>
            <span className="ds-person">
              <span className="ds-name">
                {(guardian.first + " " + guardian.last).trim() || "Guardian"}
              </span>
              <span className="ds-sub">
                {[guardian.email, guardian.phone].filter(Boolean).join(" · ")}
              </span>
            </span>
          </div>
        </div>
      )}

      <div className="ds-group">
        <span className="ds-k">{accountLabel}</span>
        <div className="ds-row">
          <span className="ds-sub">{accountLine}</span>
        </div>
      </div>

      <div className="ds-group">
        <span className="ds-k">Agreed</span>
        <div className="ds-row">
          <span className="ds-sub">Terms, Participant Waiver &amp; Refund Policy accepted</span>
        </div>
      </div>
    </div>
  );
}

export function CheckoutView(props: CheckoutViewProps) {
  const {
    camp,
    kidsMode,
    players,
    guardian,
    showGuardian,
    prefill,
    acct,
    savedCardOpen,
    subtotal,
    agree,
    entering,
    leaving,
    updatePlayer,
    addPlayer,
    removePlayer,
    setGuardian,
    setSavedCardOpen,
    setAgree,
    onContinuePayment,
    onEditDetails,
    onPay,
    paymentContent,
    checkoutError,
    continuePaymentLabel,
    continuePaymentDisabled,
    payButtonLabel,
    payButtonDisabled,
  } = props;

  const PRICE = camp.pricePerPlayer;
  // 13% HST added on top — mirrors the API charge exactly (cent-accurate).
  const { tax, total } = checkoutAmount(subtotal);
  const collectTshirtSizes = Boolean(camp.collectTshirtSizes);
  const hasCateredLunch = camp.lunchType === "catered";
  const [policyOpen, setPolicyOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const unit = kidsMode ? "child" : "player";
  const units = kidsMode ? "children" : "players";
  const multi = players.length > 1;

  const playerOk = (p: Player) =>
    kidsMode
      ? Boolean(
          p.first.trim() &&
            p.last.trim() &&
            String(p.age).trim() &&
            (!collectTshirtSizes || p.tee.trim()),
        )
      : Boolean(
          p.first.trim() &&
            p.last.trim() &&
            looksLikeEmail(p.email) &&
            (!collectTshirtSizes || p.tee.trim()),
        );
  const playersOk = players.every(playerOk);
  const guardianOk =
    !showGuardian ||
    Boolean(
      guardian.first.trim() &&
        guardian.last.trim() &&
        guardian.phone.trim() &&
        looksLikeEmail(guardian.email) &&
        guardian.authorized,
    );
  const detailsOk = playersOk && guardianOk && agree.terms;
  const editDetails = () => {
    setRevealed(false);
    onEditDetails?.();
  };
  const reveal = async () => {
    if (!detailsOk || isContinuing) return;
    setIsContinuing(true);
    try {
      const canReveal = await onContinuePayment?.();
      if (canReveal !== false) setRevealed(true);
    } finally {
      setIsContinuing(false);
    }
  };

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) window.history.back();
    // INTEGRATION: replace with router.back() / a link to the camp detail page.
  };

  return (
    <div className="shell view">
      <button type="button" className="back-link" onClick={goBack}>
        <Icon name="back" size={18} strokeWidth={2.5} /> Back
      </button>
      <div className="checkout-grid">
        <div className="panel">
          <div className="panel-head">
            <span className="eyebrow">{camp.eyebrow}</span>
            <h1 className="camp-title">{camp.title}</h1>
            <div className="coach-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={camp.coachPhoto} alt={camp.coachLead} />
              <span className="ct">
                Led by <b>{camp.coachLead}</b>{" "}&amp; the Breakaway coaching team
              </span>
            </div>
            <div className="camp-meta">
              <div className="m">
                <span className="ico">
                  <Icon name="cal" size={15} />
                </span>
                <span>
                  <span className="k">Dates</span>
                  <br />
                  <span className="v">{camp.date}</span>
                </span>
              </div>
              <div className="m">
                <span className="ico">
                  <Icon name="trend" size={15} />
                </span>
                <span>
                  <span className="k">Skill level</span>
                  <br />
                  <span className="v">
                    {camp.skill}{" "}
                    <span style={{ color: "var(--neutral-500)", fontWeight: 500 }}>
                      ({camp.skillSub})
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="panel-body">
            <div className="section">
              <div className="sec-head">
                <span className="sec-num">1</span>
                <h3 className="sec-title">{kidsMode ? "Campers & details" : "Players & details"}</h3>
                {revealed && (
                  <button type="button" className="step-edit" onClick={editDetails}>
                    Edit
                  </button>
                )}
              </div>

              {revealed ? (
                <DetailsSummary
                  kidsMode={kidsMode}
                  players={players}
                  guardian={guardian}
                  showGuardian={showGuardian}
                  collectTshirtSizes={collectTshirtSizes}
                  prefill={prefill}
                  acct={acct}
                />
              ) : (
                <div className="step-body">
                  <div className="substep">
                    <h4 className="substep-title">{kidsMode ? "Who's attending" : "Who's playing"}</h4>
                    <p className="sec-sub">
                      {kidsMode
                        ? "Add each child you're registering — every camper gets their own spot."
                        : prefill
                          ? "You're playing — that's set from your account. Add friends or family below if they're coming too."
                          : "Booking for yourself? You're set — or add more players. Each player gets their spot."}
                    </p>
                    {players.map((p, i) => {
                      const removable = kidsMode ? players.length > 1 : i > 0;
                      if (!kidsMode && i === 0 && prefill) {
                        return (
                          <YouCard
                            key={p.id}
                            p={p}
                            multi={multi}
                            tshirts={collectTshirtSizes}
                            onChange={(patch) => updatePlayer(i, patch)}
                          />
                        );
                      }
                      return (
                        <PlayerCard
                          key={p.id}
                          p={p}
                          idx={i}
                          isYou={!kidsMode && i === 0}
                          multi={multi}
                          kidsMode={kidsMode}
                          tshirts={collectTshirtSizes}
                          prefill={prefill}
                          entering={entering.includes(p.id)}
                          leaving={leaving.includes(p.id)}
                          onChange={(patch) => updatePlayer(i, patch)}
                          onRemove={removable ? () => removePlayer(i) : null}
                        />
                      );
                    })}

                    {players.length < camp.maxPlayers && (
                      <button
                        type="button"
                        className="chip"
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          borderStyle: "dashed",
                          minHeight: 46,
                          marginTop: 2,
                        }}
                        onClick={addPlayer}
                      >
                        + Add another {unit}{" "}
                        <span style={{ color: "var(--neutral-400)", fontWeight: 500 }}>
                          · ${PRICE} CAD each
                        </span>
                      </button>
                    )}
                  </div>

                  {showGuardian && (
                    <div className="substep">
                      <h4 className="substep-title">Parent / guardian</h4>
                      <p className="sec-sub">
                        This is you — the grown-up registering. You won&apos;t be on court.
                      </p>
                      <Guardian
                        g={guardian}
                        childCount={players.length}
                        prefill={prefill}
                        onChange={(patch) => setGuardian((g) => ({ ...g, ...patch }))}
                      />
                    </div>
                  )}

                  {prefill && (
                    <div className="substep">
                      <h4 className="substep-title">Your account</h4>
                      <div className="loggedin">
                        <span className="av">{acct.first.charAt(0)}</span>
                        <span className="txt">
                          {kidsMode ? (
                            <>
                              Registering as{" "}
                              <b>
                                {acct.first} {acct.last}
                              </b>{" "}
                              · parent / guardian · {acct.email}
                            </>
                          ) : (
                            <>
                              Signed in as <b>{acct.email}</b>
                            </>
                          )}
                          <br />
                          <span style={{ color: "var(--neutral-500)" }}>
                            Camp details, photos &amp; receipts save straight to My Camps.
                          </span>
                        </span>
                        <button className="switch-acct" type="button">
                          Not you?
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="substep">
                    <h4 className="substep-title">Confirm &amp; agree</h4>
                    <div className="agreements">
                      <label className="check">
                        <input
                          type="checkbox"
                          checked={agree.terms}
                          onChange={(e) => setAgree((a) => ({ ...a, terms: e.target.checked }))}
                        />
                        <span className="box">
                          <Icon name="check" size={14} strokeWidth={3} />
                        </span>
                        <span className="txt">
                          I agree to the{" "}
                          <a
                            href="https://breakawaypickleball.ca/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Terms
                          </a>
                          ,{" "}
                          <a
                            href="https://breakawaypickleball.ca/waiver"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Participant Waiver
                          </a>
                          , and{" "}
                          <a
                            href="#policy"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setPolicyOpen(true);
                            }}
                          >
                            Refund &amp; Transfer Policy
                          </a>
                          . I understand Breakaway will contact me with important updates about my
                          booking.
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="continue-wrap">
                    <button
                      type="button"
                      className="pay-btn continue-btn"
                      disabled={!detailsOk || isContinuing || continuePaymentDisabled}
                      onClick={() => {
                        void reveal();
                      }}
                    >
                      {continuePaymentLabel ?? (
                        <>
                          <Icon name="card" size={20} strokeWidth={2.5} /> Continue to Payment
                        </>
                      )}
                    </button>
                    <p className="continue-hint">
                      {detailsOk
                        ? "Opens the payment section below — you won't leave this page."
                        : kidsMode
                          ? "Add each camper, your guardian details, and accept the terms to continue."
                          : "Add player details and accept the terms to continue."}
                    </p>
                    {!revealed && checkoutError}
                  </div>
                </div>
              )}
            </div>

            <div
              className={
                "section pay-section" +
                (revealed ? " open reveal-section" : detailsOk ? " ready" : " locked")
              }
              id="payment"
            >
              <div className="sec-head">
                <span className="sec-num">2</span>
                <h3 className="sec-title">Payment</h3>
                {revealed ? (
                  <button type="button" className="step-edit" onClick={editDetails}>
                    Edit
                  </button>
                ) : (
                  <span className="sec-lock">
                    <Icon name="lock" size={15} />
                  </span>
                )}
              </div>

              {!revealed && (
                <p className="pay-collapsed-hint">
                  {detailsOk
                    ? "Ready when you are — choose Continue to Payment above."
                    : "Complete the details above to unlock payment."}
                </p>
              )}

              {revealed && (
                <>
                <p
                  className="sec-sub"
                  style={{ display: "flex", alignItems: "center", gap: 7 }}
                >
                  <span style={{ display: "inline-flex", flex: "none" }}>
                    <Icon name="lock" size={14} />
                  </span>{" "}
                  256-bit encrypted. You&apos;re only charged when you book.
                </p>
                {paymentContent ? (
                  paymentContent
                ) : prefill && !savedCardOpen ? (
                  <div className="savedcard">
                    <span className="brand-ic">
                      <svg viewBox="0 0 48 32" style={{ width: 26, height: 17 }}>
                        <rect width="48" height="32" rx="4" fill="#fff" />
                        <text
                          x="24"
                          y="21"
                          textAnchor="middle"
                          fontFamily="Geist, sans-serif"
                          fontWeight="800"
                          fontSize="13"
                          fill="#124A7A"
                        >
                          {acct.savedCard.brand.toUpperCase()}
                        </text>
                      </svg>
                    </span>
                    <span className="cc">
                      {acct.savedCard.brand} ending in {acct.savedCard.last4}
                      <small>Saved to your account · expires {acct.savedCard.exp}</small>
                    </span>
                    <button className="chg" type="button" onClick={() => setSavedCardOpen(true)}>
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <Field label="Card number" req>
                      <div className="inp-wrap">
                        <span className="lead">
                          <Icon name="lock" size={16} />
                        </span>
                        <input className="inp" inputMode="numeric" placeholder="1234 1234 1234 1234" />
                        <span className="trail">
                          <Visa />
                        </span>
                      </div>
                    </Field>
                    <div className="field-row">
                      <Field label="Expiry" req>
                        <input className="inp" placeholder="MM / YY" inputMode="numeric" />
                      </Field>
                      <Field label="CVC" req>
                        <input className="inp" placeholder="123" inputMode="numeric" maxLength={4} />
                      </Field>
                    </div>
                    <Field label="Name on card" req>
                      <input className="inp" placeholder="Jordan Lee" />
                    </Field>
                  </>
                )}
                {checkoutError}
                </>
              )}
            </div>
          </div>
        </div>

        <aside className="summary">
          <div className="sum-card">
            <div className="sum-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={camp.photo} alt={camp.title} />
              {camp.urgencyBadge && (
                <span className="chip-badge">
                  <Icon name="flame" size={12} /> {camp.urgencyBadge}
                </span>
              )}
              <div className="ptitle">{camp.title}</div>
            </div>
            <div className="sum-body">
              <div className="sum-rows">
                <div className="r">
                  <Icon name="cal" size={15} />
                  <span>
                    <b>{camp.date}</b> · {camp.dateSub}
                  </span>
                </div>
                <div className="r">
                  <Icon name="pin" size={15} />
                  <span>
                    <b>{camp.location}</b>, {camp.locSub}
                  </span>
                </div>
                <div className="r">
                  <Icon name="users" size={15} />
                  <span>
                    <b>{camp.coachRatio}</b> player-to-coach ratio
                  </span>
                </div>
              </div>
              <div className="price-rows">
                <div className="pr">
                  <span>
                    ${PRICE} CAD × {players.length} {players.length === 1 ? unit : units}
                  </span>
                  <span>${money(subtotal)}</span>
                </div>
                {hasCateredLunch && (
                  <div className="pr">
                    <span>Catered Lunch</span>
                    <span className="free">Included</span>
                  </div>
                )}
                <div className="pr">
                  <span>HST (13%)</span>
                  <span>${money(tax)}</span>
                </div>
              </div>
              <div className="total-row">
                <span className="k">Total</span>
                <span className="v" key={total}>
                  ${money(total)}
                  <small>CAD</small>
                </span>
              </div>
              {revealed ? (
                <button className="pay-btn" onClick={onPay} disabled={payButtonDisabled ?? !detailsOk}>
                  {payButtonLabel ??
                    `Book ${players.length} ${players.length === 1 ? "Spot" : "Spots"} — $${money(
                      total,
                    )} CAD`}{" "}
                  <Icon name="arrow" size={20} strokeWidth={2.5} />
                </button>
              ) : (
                <div className="sum-cta-msg">
                  <span className="scm-ic">
                    <Icon name="user" size={15} />
                  </span>
                  Complete player details to continue.
                </div>
              )}
            </div>
          </div>
          <div className="trust">
            <span className="ico">
              <Icon name={kidsMode ? "shield" : "users"} size={17} />
            </span>
            <span className="t">
              {kidsMode ? (
                <>
                  <b>In good hands.</b>{" "}Just 4 kids per certified coach on a private, gated
                  facility — eyes on every camper, all day. You&apos;ll get a recap after each
                  session.
                </>
              ) : (
                <>
                  <b>Small by design.</b>{" "}Just 4 players per coach and no public-court distractions
                  — that&apos;s the whole point.
                </>
              )}
            </span>
          </div>
        </aside>
      </div>

      {policyOpen && (
        <div className="policy-overlay" onClick={() => setPolicyOpen(false)}>
          <div
            className="policy-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Refund and Transfer Policy"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="policy-x"
              type="button"
              aria-label="Close"
              onClick={() => setPolicyOpen(false)}
            >
              <Icon name="x" size={18} />
            </button>
            <h3 className="policy-h">Refund &amp; Transfer Policy</h3>
            <p className="policy-p">
              <b>Non-refundable, fully transferable.</b> Each camp has limited spots, and your
              booking reserves court space, coaching time, and a player spot just for you.
            </p>
            <p className="policy-p">
              Can&apos;t make it? You can transfer your spot to another player or move it to a
              future Breakaway camp up to 7 days before camp.
            </p>
            <button className="policy-done" type="button" onClick={() => setPolicyOpen(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
