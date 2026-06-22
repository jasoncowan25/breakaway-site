"use client";

import React, { useEffect, useState } from "react";
import { CheckoutView } from "./CheckoutView";
import { SuccessView } from "./SuccessView";
import type {
  Account,
  Agreements,
  Camp,
  CheckoutScenario,
  Guardian as GuardianModel,
  Player,
} from "../../lib/types";

/* ==========================================================================
   CheckoutFlow — orchestrates the booking form and the success screen.
   This is the source `App` component with the design-time Tweaks panel
   replaced by real, typed props (see CheckoutScenario in lib/types.ts):
     loggedIn  → was Tweak "Logged in"        (derive from your session)
     kidsMode  → camp.isKidsCamp              (was Tweak "Children eligible")
     backdrop  → scenario.backdrop            (cosmetic; was Tweak "Background")
     view      → scenario.initialView         (routing; was Tweak "Screen")
   All state, animations, add/remove transitions, and variant framing are
   preserved exactly.
   ========================================================================== */

export interface CheckoutFlowProps {
  camp: Camp;
  /** The authenticated customer, or null when checking out as a guest. */
  account: Account | null;
  scenario: CheckoutScenario;
}

const FALLBACK_ACCOUNT: Account = {
  first: "Jordan",
  last: "Lee",
  email: "jordan@example.com",
  savedCard: { brand: "Visa", last4: "4242", exp: "08/27" },
};

export function CheckoutFlow({ camp, account, scenario }: CheckoutFlowProps) {
  const [view, setView] = useState<"checkout" | "success">(scenario.initialView);

  const prefill = scenario.loggedIn;
  const kidsMode = camp.isKidsCamp;
  const acct: Account = account ?? FALLBACK_ACCOUNT;

  const blankPlayer = (extra: Partial<Player> = {}): Player => ({
    id: Math.random().toString(36).slice(2),
    first: "",
    last: "",
    email: "",
    age: "",
    tee: "",
    isChild: false,
    ...extra,
  });

  const [players, setPlayers] = useState<Player[]>(() => [
    prefill
      ? { id: "you", first: acct.first, last: acct.last, email: acct.email, age: "", tee: "", isChild: false }
      : { id: "you", first: "", last: "", email: "", age: "", tee: "", isChild: false },
  ]);

  const [guardian, setGuardian] = useState<GuardianModel>({
    first: "",
    last: "",
    phone: "",
    email: "",
    authorized: false,
    waiver: false,
  });
  const [entering, setEntering] = useState<string[]>([]); // ids playing their enter animation
  const [leaving, setLeaving] = useState<string[]>([]); // ids playing their exit animation
  const acctOptIn = true;
  const [savedCardOpen, setSavedCardOpen] = useState(false);
  const [agree, setAgree] = useState<Agreements>({ terms: false, marketing: false });

  // login → prefill the correct identity (guardian in kids mode, player 0 otherwise)
  useEffect(() => {
    if (!prefill) return;
    if (kidsMode) {
      setGuardian((g) => ({
        ...g,
        first: g.first || acct.first,
        last: g.last || acct.last,
        email: g.email || acct.email,
      }));
    } else {
      setPlayers((ps) =>
        ps.map((p, i) =>
          i === 0
            ? {
                ...p,
                first: p.first || acct.first,
                last: p.last || acct.last,
                email: p.email || acct.email,
              }
            : p,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill, kidsMode]);

  // kids camp reframes everything: every player becomes a child registered
  // on behalf of the (non-playing) guardian below
  useEffect(() => {
    if (kidsMode) {
      setPlayers((ps) => ps.map((p) => ({ ...p, isChild: true, email: "" })));
      if (prefill)
        setGuardian((g) => ({
          ...g,
          first: g.first || acct.first,
          last: g.last || acct.last,
          email: g.email || acct.email,
        }));
    } else {
      setPlayers((ps) => ps.map((p) => ({ ...p, isChild: false, age: "" })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidsMode]);

  const showGuardian = kidsMode;

  const updatePlayer = (i: number, patch: Partial<Player>) =>
    setPlayers((ps) => ps.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const addPlayer = () => {
    if (players.length >= camp.maxPlayers) return;
    const np = blankPlayer({ isChild: kidsMode });
    setEntering((e) => [...e, np.id]);
    setPlayers((ps) => [...ps, np]);
    setTimeout(() => setEntering((e) => e.filter((x) => x !== np.id)), 420);
  };

  const removePlayer = (i: number) => {
    const id = players[i] && players[i].id;
    if (!id) return;
    setLeaving((l) => [...l, id]);
    setTimeout(() => {
      setPlayers((ps) => ps.filter((p) => p.id !== id));
      setLeaving((l) => l.filter((x) => x !== id));
    }, 290);
  };

  const subtotal = players.length * camp.pricePerPlayer;

  const bgClass = scenario.backdrop === "photo" ? "bg-photo" : "bg-clean";
  const bgStyle: React.CSSProperties =
    scenario.backdrop === "photo"
      ? ({ "--bg-photo-url": `url(${camp.photo})` } as React.CSSProperties)
      : {};

  return (
    <div className="co-scope">
      <div className={"backdrop " + bgClass} style={{ ...bgStyle, justifyContent: "center" }}>
        {view === "checkout" ? (
          <CheckoutView
            camp={camp}
            kidsMode={kidsMode}
            players={players}
            guardian={guardian}
            showGuardian={showGuardian}
            prefill={prefill}
            acct={acct}
            savedCardOpen={savedCardOpen}
            subtotal={subtotal}
            agree={agree}
            entering={entering}
            leaving={leaving}
            updatePlayer={updatePlayer}
            addPlayer={addPlayer}
            removePlayer={removePlayer}
            setGuardian={setGuardian}
            setSavedCardOpen={setSavedCardOpen}
            setAgree={setAgree}
            onPay={() => {
              // INTEGRATION: confirm the Stripe payment, then route to the
              // confirmation page (or render success on the same route).
              setView("success");
              if (typeof window !== "undefined") window.scrollTo(0, 0);
            }}
          />
        ) : (
          <SuccessView
            camp={camp}
            kidsMode={kidsMode}
            players={players}
            guardian={guardian}
            prefill={prefill}
            acct={acct}
            acctOptIn={acctOptIn}
            onBack={() => {
              // INTEGRATION: route to the My Breakaway portal instead.
              setView("checkout");
            }}
          />
        )}
      </div>
    </div>
  );
}

export default CheckoutFlow;
