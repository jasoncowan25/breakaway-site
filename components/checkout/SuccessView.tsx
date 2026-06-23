"use client";

import React from "react";
import { Icon } from "../Icon";
import { joinNames } from "../../lib/format";
import type { Account, Camp, Guardian as GuardianModel, Player } from "../../lib/types";
import type { CampCalendarInput } from "../../lib/calendar";
import { AddToCalendar } from "../AddToCalendar";

/* ==========================================================================
   SuccessView — post-payment confirmation. Ported 1:1 from the source app.
   NOTE: the source also defines an AccountTask component (see AccountTask.tsx)
   for optional onboarding tasks; it is present-but-unwired in the source's
   rendered success card, so it is intentionally not rendered here either.
   ========================================================================== */

export interface SuccessViewProps {
  camp: Camp;
  kidsMode: boolean;
  players: Player[];
  guardian: GuardianModel;
  prefill: boolean;
  acct: Account;
  acctOptIn: boolean;
  orderLabel?: string;
  isResolving?: boolean;
  calendarEvent?: CampCalendarInput | null;
  /** True once the user taps the CTA and we're routing to the portal — drives
   *  the button's own loading state instead of flashing the card to a skeleton. */
  opening?: boolean;
  /** CTA: in the source this returns to checkout; in production route to the
   *  My Breakaway portal. INTEGRATION: replace with router.push("/portal"). */
  onBack: () => void;
}

export function SuccessView({
  camp,
  kidsMode,
  players,
  guardian,
  prefill,
  acct,
  acctOptIn,
  orderLabel,
  isResolving = false,
  calendarEvent,
  opening = false,
  onBack,
}: SuccessViewProps) {
  const recipientEmail = kidsMode
    ? guardian.email || (prefill ? acct.email : "parent@example.com")
    : prefill
      ? acct.email
      : players[0].email || "jordan@example.com";

  // INTEGRATION: use the real order/confirmation number from your payment webhook.
  const order = orderLabel ??
    "BKW-12019-" + (100000 + Math.floor(players.length * 9043)).toString().slice(0, 6);
  const unit = kidsMode ? "child" : "player";
  const units = kidsMode ? "children" : "players";
  const names = players.map((p) => p.first).filter(Boolean);
  const nameList = joinNames(names);
  const heading = kidsMode
    ? nameList
      ? `${nameList} ${names.length > 1 ? "are" : "is"} in.`
      : "They're all set."
    : `You're going${prefill || players[0].first ? `, ${prefill ? acct.first : players[0].first}` : ""}.`;
  const accountCreated = !kidsMode && (prefill || acctOptIn || isResolving);
  const SkeletonLine = ({ className = "" }: { className?: string }) => (
    <span className={`skel ${className}`} aria-hidden="true" />
  );

  return (
    <div className="shell view">
      <div className="success-wrap">
        <div className="success-card">
          <div className="success-top">
            <div className="success-badge">
              <Icon name="check" size={40} strokeWidth={3} />
            </div>
            <h1>{heading}</h1>
            <div className="order">
              Order{" "}
              {isResolving ? <SkeletonLine className="skel-order" /> : <b>#{order}</b>}
            </div>
          </div>

          <div className="success-camp">
            <span className="eb">{camp.eyebrow}</span>
            <div className="nm">
              {isResolving ? <SkeletonLine className="skel-title" /> : camp.title}
            </div>
            <div className="wc">
              {isResolving ? (
                <SkeletonLine className="skel-copy skel-center" />
              ) : (
                <>
                  {camp.coachLead} &amp; team · {players.length}{" "}
                  {players.length === 1 ? unit : units} registered
                </>
              )}
            </div>
          </div>

          <div className="success-facts">
            <div className="f">
              <div className="k">Date</div>
              <div className="v">
                {isResolving ? (
                  <>
                    <SkeletonLine className="skel-fact" />
                    <span className="sub"><SkeletonLine className="skel-sub" /></span>
                  </>
                ) : (
                  <>
                    {camp.date}
                    <span className="sub">{camp.dateSub}</span>
                  </>
                )}
              </div>
            </div>
            <div className="f">
              <div className="k">Location</div>
              <div className="v">
                {isResolving ? (
                  <>
                    <SkeletonLine className="skel-fact" />
                    <span className="sub"><SkeletonLine className="skel-sub skel-sub-wide" /></span>
                  </>
                ) : (
                  <>
                    {camp.location}
                    <span className="sub">{camp.locSub} · exact address emailed</span>
                  </>
                )}
              </div>
            </div>
            <div className="f">
              <div className="k">{kidsMode ? "Sent to guardian" : "Confirmation sent to"}</div>
              <div className="v">
                {isResolving ? <SkeletonLine className="skel-email" /> : recipientEmail}
              </div>
            </div>
          </div>

          <div className="ticket-btns">
            <AddToCalendar event={isResolving ? null : calendarEvent ?? null} />
          </div>

          {!kidsMode && players.length > 1 && (
            <div className="emails-note">
              <span className="ei">
                <Icon name="mail" size={16} />
              </span>
              <span>
                We also emailed the{" "}
                {players.length - 1 === 1
                  ? "other player"
                  : `other ${players.length - 1} players`}{" "}
                their own gate pass &amp; a link to set up their Breakaway account.
              </span>
            </div>
          )}

          <div className="success-acct">
            {accountCreated ? (
              <div className="acct-note">
                <span className="an-ico">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/breakaway-monogram.png" alt="Breakaway" />
                </span>
                <div className="an-copy">
                  <div className="an-h">
                    {prefill
                      ? "Saved to your Breakaway account"
                      : "Your Breakaway account is ready"}
                  </div>
                  <div className="an-p">
                    {isResolving ? (
                      <>
                        <SkeletonLine className="skel-acct-copy" />
                        <SkeletonLine className="skel-acct-copy skel-acct-copy-short" />
                      </>
                    ) : prefill ? (
                      <>
                        Photos, receipts &amp; full camp details live in <b>My Camps</b>. You can
                        add dietary needs or a shot to work on there anytime before camp.
                      </>
                    ) : (
                      <>
                        We emailed <b>{recipientEmail}</b> a one-tap magic link — no password.
                        View your camp details, add dietary restrictions, and set your Game Plan.
                      </>
                    )}
                  </div>
                  {isResolving ? (
                    <span className="an-cta-skel" aria-hidden="true" />
                  ) : (
                    <button
                      className={`an-cta${opening ? " is-loading" : ""}`}
                      onClick={onBack}
                      disabled={opening}
                      aria-busy={opening}
                    >
                      {opening ? (
                        <>
                          <span className="an-cta-spinner" aria-hidden="true" />
                          Opening your account…
                        </>
                      ) : (
                        <>
                          Go To My Account{" "}
                          <Icon name="arrow" size={16} strokeWidth={2.5} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="acct-note plain">
                <span className="an-ico">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/breakaway-monogram.png" alt="Breakaway" />
                </span>
                <div className="an-copy">
                  <div className="an-h">Everything&apos;s in your inbox</div>
                  <div className="an-p">
                    We sent <b>{recipientEmail}</b> the confirmation, receipt, and camp-day
                    details. Bring that confirmation email with you when you arrive.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
