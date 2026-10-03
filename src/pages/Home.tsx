/*
LOOP:
  Holder opens Oath (N days / price floor X)
  → Protocol mints USD-S immediately
  → Break tickets market opens (bets holder will sell)
  → Break premiums + fees pay down the debt while Oath holds
  → Hold to term: debt ~cleared, $STIO + upside stay with holder
  → Break early: penalty to Break buyers + protocol pool

PERSONAS: Oath maker | Break buyer
*/

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { MetalLink } from "../components/MetalButton";
import { MarqueeTicker } from "../components/MarqueeTicker";
import { HeroPortrait } from "../components/HeroPortrait";
import { RevealOnScroll } from "../components/RevealOnScroll";

const STEPS = [
  {
    n: "01",
    title: "OATH",
    body: "Commit an oath: do not sell for N days / below price X. The coin stays yours.",
    form: "FORM ST-01 · OATH",
  },
  {
    n: "02",
    title: "MINT",
    body: "Protocol issues USD-S against the Oath. Cash now — without a bank-style pledge.",
    form: "FORM ST-02 · DISBURSE",
    active: true,
  },
  {
    n: "03",
    title: "BREAK",
    body: "A Break tickets book opens. Others bet you will surrender and sell.",
    form: "FORM ST-03 · BOOK",
  },
  {
    n: "04",
    title: "PAYDOWN",
    body: "Their premiums + fees pay down your debt while you hold the line.",
    form: "FORM ST-04 · SCHEDULE",
  },
] as const;

const DESKS = [
  {
    id: "01",
    title: "THE OATH",
    tag: "DESK 01 · OATH",
    body: "Lock commitment, not custody-as-bank. Define N days and floor X. Upside stays with you.",
    footL: "TERM LIVE",
    footR: "90D · FLOOR $0.42",
  },
  {
    id: "02",
    title: "USD-S WINDOW",
    tag: "DESK 02 · MINT",
    body: "Draw protocol stable against the committed Oath. Liquidity without dumping $STIO.",
    footL: "ISSUED TODAY",
    footR: "+$128.4K USD-S",
  },
  {
    id: "03",
    title: "BREAK BOOK",
    tag: "DESK 03 · MARKET",
    body: "Buyers price your discipline. Premiums fund debt paydown; early break pays them + the pool.",
    footL: "OPEN INTEREST",
    footR: "$84.2K PREMIUM",
  },
] as const;

const BOARD = [
  {
    grade: "A",
    paper: "Long oath · deep floor · high Break cover",
    term: "180D",
    desks: "OATH · USD-S · BREAK",
  },
  {
    grade: "B",
    paper: "Standard oath · mid floor · active book",
    term: "90D",
    desks: "OATH · USD-S · BREAK",
  },
  {
    grade: "C",
    paper: "Short oath · soft floor · thin premiums",
    term: "30D",
    desks: "OATH · USD-S",
  },
  {
    grade: "D",
    paper: "Tight term · speculative Break interest",
    term: "14D",
    desks: "BREAK · WINDOW",
  },
] as const;

const TICKER =
  "OATH #184 ACTIVE · DEBT −$420/hr · BREAK OI $84.2K · USD-S 1.0001 · $STIO $0.48 · HONORED 126 · BROKEN 11 · CAPS APPLY · ";

const PATH_STEPS = [
  {
    v: "N",
    label: "TERM SET",
    detail: "You set duration N. The oath clock starts when the Oath is committed.",
  },
  {
    v: "X",
    label: "FLOOR SET",
    detail: "You set floor X. Selling below X or dumping early is a break.",
  },
  {
    v: "MINT",
    label: "USD-S OUT",
    detail: "USD-S is minted to you immediately against the committed Oath.",
  },
  {
    v: "BOOK",
    label: "BREAK LIVE",
    detail: "Break tickets list. Speculators pay premium to bet you fold.",
  },
  {
    v: "PAY",
    label: "DEBT FALLS",
    detail: "Premiums and fees continuously pay down debt while you hold.",
  },
  {
    v: "END",
    label: "HONORED",
    detail:
      "Term complete: debt cleared or nearly so. Coin and growth remain yours.",
  },
] as const;

const PATH_HEIGHTS = [
  "h-[220px]",
  "h-[200px]",
  "h-[180px]",
  "h-[160px]",
  "h-[140px]",
  "h-[120px]",
];

export function Home() {
  const [ladder, setLadder] = useState(2);

  // Old #hero / #top hashes should land at absolute page top
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "hero" || hash === "top" || hash === "") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      if (hash === "hero" || hash === "top") {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-black text-[#f5f5f5]"
      style={{ ["--top-band" as string]: "4.75rem" }}
    >
      <SiteHeader />

      <section
        id="top"
        className="grid-bg-hero relative min-h-[100svh] overflow-hidden border-b border-[#2a2a2a]"
      >
        {/*
          --top-band clears the compact fixed header.
          Content starts just under it (items-start) — no tall empty band
          from vertical centering between чёлка and Franklin.
        */}
        <div className="box-border min-h-[100svh] pt-[var(--top-band)]">
          <div className="mx-auto grid w-full max-w-7xl items-start gap-8 px-4 pb-12 pt-3 md:grid-cols-[1fr_1fr] md:gap-8 md:px-5 md:pb-14 md:pt-4 lg:gap-6 lg:px-6">
          <div className="hero-copy max-w-xl justify-self-start self-center md:-translate-x-2 lg:-translate-x-4 xl:-translate-x-6">
            <div className="hero-in hero-in-1 mb-6 inline-flex rounded-full border border-[#ccff00]/40 px-3 py-1 text-[10px] tracking-[0.18em] text-[#ccff00]">
              · STATIO PROTOCOL · $STIO · USD-S ·
            </div>
            <h1 className="mb-5 text-4xl leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              <span className="hero-line hero-line-1 block overflow-hidden">
                <span className="hero-line-inner block bg-gradient-to-b from-white to-[#d4b87a] bg-clip-text text-transparent">
                  KEEP THE COIN.
                </span>
              </span>
              <span className="hero-line hero-line-2 block overflow-hidden">
                <span className="hero-line-inner block text-[#ccff00]">
                  TAKE THE CASH.
                </span>
              </span>
            </h1>
            <div className="hero-in hero-in-3 hero-lede mb-8 pl-4 text-sm font-normal leading-relaxed text-[#cfcfcf] md:text-base">
              You need liquidity but you will not sell. Open a{" "}
              <span className="font-semibold text-white">Oath</span> — do not sell
              for N days / below price X. Protocol mints{" "}
              <span className="font-semibold text-white">USD-S</span>. A{" "}
              <span className="font-semibold text-white">Break</span> market bets
              you fold; their premiums pay down your debt while you hold.{" "}
              <span className="font-semibold text-white">
                Your upside stays yours.
              </span>
            </div>
            <div className="hero-in hero-in-4 flex flex-wrap gap-3">
              <MetalLink
                to="/terminal"
                className="gap-2 px-6 py-3 text-[12px]"
              >
                OPEN A TICKET <ArrowRight size={16} />
              </MetalLink>
            </div>
          </div>

          <HeroPortrait />
          </div>
        </div>
      </section>

      <section className="border-b border-[#2a2a2a]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-6 md:grid-cols-4 md:px-8">
          {[
            ["OPEN OATHS", "184"],
            ["BREAK OI", "$84.2K"],
            ["DEBT PAID", "$2.1M"],
            ["USD-S SUPPLY", "$6.4M"],
          ].map(([l, v]) => (
            <div key={l} className="panel px-4 py-4">
              <div className="mb-1 text-[10px] tracking-[0.16em] text-[#9a9a9a]">
                {l}
              </div>
              <div className="text-2xl text-[#ccff00]">{v}</div>
            </div>
          ))}
        </div>
        <MarqueeTicker text={TICKER} />
      </section>

      <section
        id="loop"
        className="border-b border-[#2a2a2a] px-5 py-16 md:px-8 md:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl tracking-tight md:text-4xl">
              <span className="text-[#ccff00]">§ 01</span>{" "}
              <span className="text-white">HOW THE</span>{" "}
              <span className="text-[#ccff00]">OATH WORKS</span>
            </h2>
            <p className="text-[11px] tracking-[0.14em] text-[#9a9a9a]">
              CASH WITHOUT SELLING · MARKET ON YOUR DISCIPLINE
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <RevealOnScroll
                key={s.n}
                variant="up"
                delay={i * 90}
                className="h-full"
              >
                <div
                  className={`frame-form flex h-full flex-col p-5 ${
                    "active" in s && s.active ? "border-[#ccff00]" : ""
                  }`}
                >
                  <span className="frame-form-corners" aria-hidden />
                  <span className="frame-form-mark">ST-{s.n}</span>
                  <div className="mb-3 text-[11px] tracking-[0.14em] text-[#ccff00]">
                    {s.n} {s.title}
                  </div>
                  <p className="mb-6 flex-1 text-sm font-normal leading-relaxed text-[#cfcfcf]">
                    {s.body}
                  </p>
                  <div className="border-t border-[#2a2a2a] pt-3 text-[10px] tracking-[0.12em] text-[#9a9a9a]">
                    {s.form}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section
        id="oath"
        className="border-b border-[#2a2a2a] px-5 py-16 md:px-8 md:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl tracking-tight md:text-4xl">
              <span className="text-[#ccff00]">§ 02</span>{" "}
              <span className="text-white">THE OATH</span>
            </h2>
            <p className="text-[11px] tracking-[0.14em] text-[#9a9a9a]">
              ADMISSION DESK · WINDOW 1
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 text-sm font-normal leading-relaxed text-[#cfcfcf]">
              <p>
                You hold the coin. You do not want to sell — but you need cash.
              </p>
              <p>
                You do not hand the asset into a classic bank-style pledge. You
                open an Oath: do not sell for N days / below price X.
              </p>
              <p>
                The protocol immediately issues you USD-S (protocol stable). In
                parallel, a Break tickets market opens: people bet you will fold
                and sell.
              </p>
              <p className="rounded-full border border-[#2a2a2a] bg-[#121212] px-4 py-3 text-[11px] tracking-[0.08em] text-[#ccff00]">
                THEIR PREMIUMS PAY YOUR DEBT. YOUR UPSIDE STAYS YOURS.
              </p>
            </div>

            <RevealOnScroll variant="ticket" delay={120}>
              <div className="frame-ticket relative overflow-hidden p-6 pl-8">
                <span className="frame-ticket-stripe" aria-hidden />
                <div className="absolute top-0 bottom-0 left-0 z-[1] flex w-5 flex-col items-center justify-evenly py-5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-[#3a3a3a] ring-1 ring-[#ccff00]/15"
                    />
                  ))}
                </div>
                <div className="relative z-[1] pl-2">
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] tracking-[0.16em] text-[#9a9a9a]">
                        OATH RECEIPT
                      </div>
                      <div className="text-lg">#184 · $STIO</div>
                    </div>
                    <div className="stamp">ACTIVE</div>
                  </div>
                  <dl className="space-y-3 text-sm">
                    {[
                      ["LOCKED", "42,000 $STIO"],
                      ["TERM", "90D · FLOOR $0.42"],
                      ["DRAWN", "18,600 USD-S"],
                      ["DEBT LEFT", "11,240 USD-S"],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between border-b border-[#2a2a2a] pb-2"
                      >
                        <dt className="text-[10px] tracking-[0.14em] text-[#9a9a9a]">
                          {k}
                        </dt>
                        <dd
                          className={
                            k === "DEBT LEFT" ? "text-[#ccff00]" : "text-white"
                          }
                        >
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-5 text-[10px] font-normal tracking-[0.08em] text-[#9a9a9a]">
                    Hold to term → debt nearly cleared. Break early → penalty to
                    Break buyers + protocol pool.
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section
        id="board"
        className="border-b border-[#2a2a2a] px-5 py-16 md:px-8 md:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl tracking-tight md:text-4xl">
              <span className="text-[#ccff00]">§ 03</span>{" "}
              <span className="text-white">COMMITMENT</span>{" "}
              <span className="text-[#ccff00]">BOARD</span>
            </h2>
            <p className="text-[11px] tracking-[0.14em] text-[#9a9a9a]">
              GRADES OF THE OATH
            </p>
          </div>
          <div className="panel overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-[10px] tracking-[0.16em] text-[#9a9a9a]">
                  <th className="px-5 py-4 font-normal">GRADE</th>
                  <th className="px-5 py-4 font-normal">PAPER</th>
                  <th className="px-5 py-4 font-normal">TERM</th>
                  <th className="px-5 py-4 font-normal">DESKS</th>
                </tr>
              </thead>
              <tbody>
                {BOARD.map((row) => (
                  <tr key={row.grade} className="border-b border-[#2a2a2a]">
                    <td className="px-5 py-4 text-[#ccff00]">
                      <span className="mr-2 inline-block h-2 w-2 rounded-sm bg-[#ccff00]/80" />
                      {row.grade}
                    </td>
                    <td className="px-5 py-4 font-normal text-[#cfcfcf]">
                      {row.paper}
                    </td>
                    <td className="px-5 py-4 text-[#ccff00]">{row.term}</td>
                    <td className="px-5 py-4 text-[11px] tracking-wider text-[#9a9a9a]">
                      {row.desks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-[#2a2a2a] px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl tracking-tight md:text-4xl">
              <span className="text-[#ccff00]">§ 04</span>{" "}
              <span className="text-white">THREE</span>{" "}
              <span className="text-[#ccff00]">DESKS</span>
            </h2>
            <p className="text-[11px] tracking-[0.14em] text-[#9a9a9a]">
              THE LOOP PAYS THE DEBT
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {DESKS.map((d, i) => (
              <div
                key={d.id}
                className={`panel flex flex-col p-5 ${
                  i === 0 ? "border-[#ccff00]" : ""
                }`}
              >
                <div className="mb-2 text-[11px] tracking-[0.14em] text-[#ccff00]">
                  {d.tag}
                </div>
                <h3 className="mb-3 text-xl">{d.title}</h3>
                <p className="mb-6 flex-1 text-sm font-normal leading-relaxed text-[#cfcfcf]">
                  {d.body}
                </p>
                <div className="flex items-center justify-between border-t border-[#2a2a2a] pt-3 text-[10px] tracking-[0.12em]">
                  <span className="text-[#9a9a9a]">{d.footL}</span>
                  <span className="text-[#ccff00]">{d.footR}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="break"
        className="relative overflow-hidden border-b border-[#2a2a2a] px-5 py-16 md:px-8 md:py-20"
      >
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl tracking-tight md:text-4xl">
              <span className="text-[#ccff00]">§ 05</span>{" "}
              <span className="text-white">BREAK</span>{" "}
              <span className="text-[#ccff00]">TICKETS</span>
            </h2>
            <p className="text-[11px] tracking-[0.14em] text-[#9a9a9a]">
              BET ON SURRENDER · FUND THE HOLD
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <RevealOnScroll variant="ticket" delay={80} className="relative z-10">
              <div className="frame-ticket relative overflow-hidden p-6 pl-8">
                <span className="frame-ticket-stripe" aria-hidden />
                <div className="absolute top-0 bottom-0 left-0 z-[1] flex w-5 flex-col items-center justify-evenly py-5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-[#3a3a3a] ring-1 ring-[#ccff00]/15"
                    />
                  ))}
                </div>
                <div className="relative z-[1] pl-2">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="text-[10px] tracking-[0.16em] text-[#ccff00]">
                      BREAK BOOK // LIVE
                    </span>
                    <span className="stamp !rotate-[-8deg]">OPEN</span>
                  </div>
                  <dl className="space-y-3 text-sm">
                    {[
                      ["OPEN INTEREST", "$84,200"],
                      ["PREMIUM FLOW", "$420 / hr"],
                      ["DEBT COVERED", "39%"],
                      ["ON BREAK → BUYERS", "Penalty share"],
                      ["ON BREAK → POOL", "Protocol cut"],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between border-b border-[#2a2a2a] pb-2"
                      >
                        <dt className="text-[10px] tracking-[0.12em] text-[#9a9a9a]">
                          {k}
                        </dt>
                        <dd className="text-[#ccff00]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <MetalLink to="/terminal" className="mt-6">
                    BUY BREAK
                  </MetalLink>
                </div>
              </div>
            </RevealOnScroll>
            <div className="relative z-10 min-h-[280px] space-y-4 text-sm font-normal leading-relaxed text-[#cfcfcf] md:min-h-[320px]">
              <p>
                Their premiums + fees from this market pay down your debt while
                you hold.
              </p>
              <p>
                Hold to term → debt is almost / fully cleared; the coin and all
                growth stay yours.
              </p>
              <p>
                Break the oath early → the penalty goes to Break buyers and the
                protocol pool.
              </p>
              <p className="relative z-10 text-[#9a9a9a]">
                Two sides. One loop. The desk does not need you to sell.
              </p>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[min(52%,420px)] overflow-hidden"
          aria-hidden
        >
          <img
            src="/break-skull.png"
            alt=""
            className="break-skull absolute bottom-0 right-0 h-[88%] max-h-[520px] w-auto max-w-none object-contain object-right-bottom opacity-[0.88]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/90" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent" />
        </div>
      </section>

      {/* § 06 THE PATH */}
      <section className="border-b border-[#2a2a2a] px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-normal tracking-[0.04em] md:text-4xl">
              <span className="font-normal text-[#ccff00]">§ 06</span>{" "}
              <span className="font-light text-white">THE PATH</span>
            </h2>
            <p className="text-[11px] font-normal tracking-[0.18em] text-[#9a9a9a]">
              FROM COMMIT TO HONOR
            </p>
          </div>

          <div className="mb-5 flex items-end gap-2.5 overflow-x-auto overflow-y-visible px-0.5 pb-3 pt-4">
            {PATH_STEPS.map((step, i) => (
              <button
                key={step.v}
                type="button"
                onClick={() => setLadder(i)}
                className={`path-card flex w-full min-w-[96px] flex-1 flex-col items-center justify-between rounded-2xl border px-3 py-5 ${
                  PATH_HEIGHTS[i]
                } ${
                  ladder === i
                    ? "border-[#ccff00] bg-[#161616] shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
                    : "border-[#2a2a2a] bg-[#141414]"
                }`}
              >
                <span className="text-2xl font-light tracking-[0.08em] text-[#ccff00] md:text-[1.75rem]">
                  {step.v}
                </span>
                <span className="text-center text-[9px] font-normal tracking-[0.16em] text-[#8a8a8a]">
                  {step.label}
                </span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[#ccff00]/35 bg-[#121212] px-5 py-4 text-sm font-normal leading-relaxed text-[#cfcfcf] transition-colors duration-300">
            <span className="font-medium tracking-[0.08em] text-[#ccff00]">
              AT {PATH_STEPS[ladder].v}
            </span>
            <span className="text-[#6a6a6a]"> · </span>
            {PATH_STEPS[ladder].detail}
          </div>
        </div>
      </section>

      <section
        id="token"
        className="border-b border-[#2a2a2a] px-5 py-16 md:px-8 md:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-2 text-3xl tracking-tight md:text-4xl">
            <span className="text-[#ccff00]">§ 07</span>{" "}
            <span className="text-white">THE HOUSE TOKEN</span>
          </h2>
          <p className="mb-10 text-sm tracking-[0.12em] text-[#9a9a9a]">
            $STIO · FIXED SUPPLY · OATH COLLATERAL
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="panel border-[#ccff00]/50 p-5">
              <div className="mb-3 text-[10px] tracking-[0.16em] text-[#ccff00]">
                WHAT $STIO DOES
              </div>
              <div className="space-y-3 text-sm font-normal text-[#cfcfcf]">
                <p>
                  <span className="text-[#ccff00]">THE OATH ASSET.</span> Lock
                  $STIO under oath to mint USD-S without selling.
                </p>
                <p>
                  <span className="text-[#ccff00]">KEEP THE UPSIDE.</span> Honor
                  the term — coin and growth stay with you.
                </p>
              </div>
            </div>
            <div className="panel p-5">
              <div className="mb-3 text-[10px] tracking-[0.16em] text-[#ccff00]">
                TERMS
              </div>
              <dl className="space-y-2 text-sm">
                {[
                  ["SUPPLY", "FIXED"],
                  ["STABLE", "USD-S"],
                  ["ACT", "OATH / BREAK"],
                  ["PLEDGE MODEL", "OATH, NOT BANK"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <dt className="text-[10px] tracking-[0.12em] text-[#9a9a9a]">
                      {k}
                    </dt>
                    <dd className="text-[#ccff00]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section id="honesty" className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="panel p-6 md:p-8">
            <div className="mb-6 text-[11px] tracking-[0.16em] text-[#ccff00]">
              BEFORE YOU COME TO THE WINDOW
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "NOT A BANK PLEDGE.",
                  "You do not hand the asset to a classic collateral desk. You commit an Oath on sale discipline.",
                ],
                [
                  "BREAK IS A MARKET.",
                  "Others price whether you will hold. Their premiums help pay down your debt.",
                ],
                [
                  "CAPS APPLY.",
                  "Desk limits exist. Treat figures as live-shaped stubs until contracts are final.",
                ],
                [
                  "EARLY BREAK HAS A PRICE.",
                  "Break the oath early and the penalty routes to Break buyers and the protocol pool.",
                ],
              ].map(([t, b]) => (
                <div key={t}>
                  <h3 className="mb-2 text-[12px] tracking-[0.08em] text-[#ccff00]">
                    {t}
                  </h3>
                  <p className="text-sm font-normal leading-relaxed text-[#cfcfcf]">
                    {b}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#2a2a2a] px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <img
                src="/logo.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <span>STATIO</span>
            </div>
            <div className="text-[10px] tracking-[0.14em] text-[#9a9a9a]">
              $STIO · OATH PROTOCOL · USD-S
            </div>
          </div>
          <div className="flex gap-5 text-[11px] tracking-[0.14em] text-[#9a9a9a]">
            <a href="#honesty" className="hover:text-white">
              DOCS
            </a>
            <a href="#" className="hover:text-white">
              X
            </a>
            <a href="#" className="hover:text-white">
              EXPLORER
            </a>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full border border-[#ccff00]/50 px-3 py-1 text-[10px] tracking-[0.12em] text-[#ccff00]">
              UNAUDITED
            </span>
            <span className="rounded-full border border-[#ccff00]/50 px-3 py-1 text-[10px] tracking-[0.12em] text-[#ccff00]">
              CAPS APPLY
            </span>
          </div>
        </div>
        <div className="mx-auto mt-8 flex max-w-7xl flex-col justify-between gap-2 border-t border-[#2a2a2a] pt-4 text-[10px] tracking-[0.12em] text-[#9a9a9a] md:flex-row">
          <span>© 2026 STATIO</span>
          <span className="text-[#ccff00]">OATHS RUN TO THEIR DATE</span>
        </div>
      </footer>
    </div>
  );
}
