import { useMemo, useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { MetalButton } from "../components/MetalButton";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { MarqueeTicker } from "../components/MarqueeTicker";

const TABS = ["OATH", "BREAK", "REPAY", "BOOK", "DESK"] as const;
const STIO_PRICE = 0.48;
const DEFAULT_DAYS = 90;
const TERM_MIN_DAYS = 14;
const TERM_MAX_DAYS = 365;

function num(raw: string) {
  const n = Number(String(raw).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function gradeFor(days: number, floor: number) {
  const depth = Math.max(0, STIO_PRICE - floor) / STIO_PRICE;
  const score = days / 180 + depth;
  if (score >= 1.1) return "A";
  if (score >= 0.75) return "B";
  if (score >= 0.45) return "C";
  return "D";
}

function ltvFor(days: number) {
  if (days >= 180) return 0.55;
  if (days >= 90) return 0.45;
  if (days >= 30) return 0.35;
  if (days >= 14) return 0.28;
  return 0.2;
}

function clampTermDays(raw: number) {
  const n = Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_DAYS;
  return Math.min(TERM_MAX_DAYS, Math.max(TERM_MIN_DAYS, Math.round(n)));
}

export function Terminal() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("OATH");
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState(String(DEFAULT_DAYS));
  const [floor, setFloor] = useState("");
  const [oathId, setOathId] = useState("");
  const [drawAmt, setDrawAmt] = useState("");
  const [repayAmt, setRepayAmt] = useState("");
  const [breakAmt, setBreakAmt] = useState("");
  const [approved, setApproved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const locked = num(amount);
  const termDays = clampTermDays(num(days) || DEFAULT_DAYS);
  const floorPx = num(floor);
  const collateralUsd = locked * STIO_PRICE;
  const ltv = ltvFor(termDays);
  const maxDraw = collateralUsd * ltv;
  const grade = gradeFor(termDays, floorPx || STIO_PRICE);
  const drawn = Math.min(num(drawAmt), maxDraw || Number.POSITIVE_INFINITY);
  const debtBase =
    loaded || drawn > 0
      ? loaded && drawn <= 0
        ? maxDraw * 0.62
        : drawn
      : 0;
  const effectiveDebt = Math.max(0, debtBase - num(repayAmt));
  const premium = num(breakAmt);
  const premiumPerHour =
    premium > 0 ? premium / Math.max(termDays * 24, 24) : locked > 0 ? locked * 0.00012 : 0;
  const breakCover =
    debtBase > 0 ? Math.min(100, (premium / Math.max(debtBase, 1)) * 100) : premium > 0 ? 100 : 0;
  const years = termDays / 365;
  const debtCoverPct = maxDraw > 0 ? Math.min(100, (effectiveDebt / maxDraw) * 100) : 0;
  const sliderFill = `${((termDays - TERM_MIN_DAYS) / (TERM_MAX_DAYS - TERM_MIN_DAYS)) * 100}%`;

  function setTermDays(next: number) {
    setDays(String(clampTermDays(next)));
  }
  const tickerText = `TIMELOCK 10 MIN · $STIO $${STIO_PRICE.toFixed(2)} · USD-S 1.0001 · GRADE ${grade} · LTV ${(ltv * 100).toFixed(0)}% · CAPS APPLY · OATHS RUN TO THEIR DATE`;

  const headerStats = useMemo(
    () => [
      { label: "$STIO LOCKED", value: locked, decimals: 0, prefix: "", suffix: "" },
      { label: "MAX USD-S", value: maxDraw, decimals: 0, prefix: "$", suffix: "" },
      { label: "BREAK COVER", value: breakCover, decimals: 1, prefix: "", suffix: "%" },
      { label: "WINDOW", value: null as number | null, text: "OPEN" },
    ],
    [locked, maxDraw, breakCover],
  );

  function loadOath() {
    if (!oathId.trim()) return;
    setLoaded(true);
    if (!amount) setAmount("10000");
    if (!days) setDays("90");
    if (!floor) setFloor("0.42");
    if (!drawAmt) setDrawAmt(String(Math.round(10000 * STIO_PRICE * 0.45 * 0.62)));
  }

  return (
    <div
      className="min-h-screen bg-black text-[#f5f5f5]"
      style={{ ["--top-band" as string]: "4.25rem" }}
    >
      <SiteHeader variant="terminal" />

      <div className="grid-bg border-b border-[#2a2a2a] pt-[var(--top-band)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 pb-7 pt-3 md:flex-row md:items-end md:justify-between md:px-8 md:pt-4">
          <div>
            <div className="mb-2 text-[10px] tracking-[0.18em] text-[#ccff00]">
              DESK TERMINAL
            </div>
            <div className="flex items-baseline gap-3">
              <AnimatedNumber
                value={184 + Math.floor(locked / 5000)}
                className="text-5xl tracking-tight md:text-6xl"
              />
              <span className="text-sm tracking-[0.16em] text-[#ccff00]">
                OPEN OATHS
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {headerStats.map((s) => (
              <div key={s.label}>
                <div className="text-[10px] tracking-[0.14em] text-[#9a9a9a]">
                  {s.label}
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  {s.text ? (
                    <span>{s.text}</span>
                  ) : (
                    <AnimatedNumber
                      value={s.value ?? 0}
                      decimals={s.decimals}
                      prefix={s.prefix}
                      suffix={s.suffix}
                    />
                  )}
                  <span className="h-1 w-6 rounded-sm bg-[#ccff00]/70" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <MarqueeTicker text={tickerText} />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-xl px-4 py-2.5 text-[11px] tracking-[0.14em] transition-colors ${
                tab === t
                  ? "border border-[#ccff00] bg-[#1a1a1a] text-[#ccff00]"
                  : "border border-[#2a2a2a] bg-[#121212] text-[#cfcfcf] hover:border-[#3a3a3a]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "OATH" && (
          <div className="mb-4 grid gap-4 lg:grid-cols-2">
            <div className="panel p-5 md:p-6">
              <div className="mb-1 text-xl tracking-wide">COMMIT AN OATH</div>
              <div className="mb-5 text-[10px] tracking-[0.14em] text-[#ccff00]">
                FORM ST-01 · OATH
              </div>

              <label className="mb-4 block">
                <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-[#9a9a9a]">
                  $STIO TO LOCK
                </span>
                <div className="flex items-center rounded-xl border border-[#2a2a2a] bg-black px-3 focus-within:border-[#ccff00]/40">
                  <input
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                    placeholder="e.g. 10000"
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#5a5a5a]"
                  />
                  <span className="text-[10px] tracking-wider text-[#9a9a9a]">
                    $STIO
                  </span>
                </div>
              </label>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <label>
                  <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-[#9a9a9a]">
                    TERM · N DAYS
                  </span>
                  <input
                    inputMode="numeric"
                    value={days}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/[^\d]/g, "");
                      if (!digits) {
                        setDays("");
                        return;
                      }
                      setTermDays(Number(digits));
                    }}
                    placeholder="e.g. 90"
                    className="w-full rounded-xl border border-[#2a2a2a] bg-black px-3 py-3 text-sm outline-none placeholder:text-[#5a5a5a] focus:border-[#ccff00]/40"
                  />
                </label>
                <label>
                  <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-[#9a9a9a]">
                    FLOOR · PRICE X
                  </span>
                  <input
                    inputMode="decimal"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value.replace(/[^\d.]/g, ""))}
                    placeholder="e.g. 0.42"
                    className="w-full rounded-xl border border-[#2a2a2a] bg-black px-3 py-3 text-sm outline-none placeholder:text-[#5a5a5a] focus:border-[#ccff00]/40"
                  />
                </label>
              </div>

              <div className="mb-5">
                <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-[#9a9a9a]">
                  WALLET ALLOWANCE
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-black px-3">
                  <span
                    className={`min-w-0 flex-1 select-none py-3 text-sm ${
                      approved ? "text-[#7dffa0]" : "text-[#5a5a5a]"
                    }`}
                  >
                    {approved
                      ? `$STIO approved · ready to commit`
                      : `Approve $STIO to continue`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setApproved(true)}
                    className="shrink-0 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-[10px] tracking-wider text-[#ccff00] transition-colors hover:bg-[#222]"
                  >
                    APPROVE
                  </button>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-3 text-[11px]">
                <div>
                  <div className="text-[9px] tracking-[0.12em] text-[#9a9a9a]">
                    COLLATERAL
                  </div>
                  <AnimatedNumber
                    value={collateralUsd}
                    decimals={0}
                    prefix="$"
                    className="text-[#ccff00]"
                  />
                </div>
                <div>
                  <div className="text-[9px] tracking-[0.12em] text-[#9a9a9a]">
                    MAX LTV
                  </div>
                  <AnimatedNumber
                    value={ltv * 100}
                    decimals={0}
                    suffix="%"
                    className="text-[#ccff00]"
                  />
                </div>
                <div>
                  <div className="text-[9px] tracking-[0.12em] text-[#9a9a9a]">
                    GRADE
                  </div>
                  <span className="text-[#ccff00]">{locked || termDays ? grade : "—"}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <MetalButton className="min-w-[120px] px-8">COMMIT</MetalButton>
                <span className="text-[11px] tracking-[0.1em] text-[#ccff00]">
                  opens ticket · unlocks USD-S draw
                </span>
              </div>
            </div>

            <div className="panel p-5 md:p-6">
              <div className="mb-1 text-xl tracking-wide">DRAW USD-S</div>
              <div className="mb-5 text-[10px] tracking-[0.14em] text-[#ccff00]">
                FORM ST-02 · DISBURSE
              </div>

              <label className="mb-5 block">
                <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-[#9a9a9a]">
                  OATH ID
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-black px-3 focus-within:border-[#ccff00]/40">
                  <input
                    value={oathId}
                    onChange={(e) => {
                      setOathId(e.target.value);
                      setLoaded(false);
                    }}
                    placeholder="e.g. 184"
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#5a5a5a]"
                  />
                  <button
                    type="button"
                    onClick={loadOath}
                    className="shrink-0 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-[10px] tracking-wider text-[#cfcfcf] transition-colors hover:text-white"
                  >
                    LOAD
                  </button>
                </div>
              </label>

              <dl className="mb-5 space-y-2.5 text-sm">
                {(
                  [
                    ["grade", loaded || locked ? grade : "—", "#ccff00", null],
                    ["locked", locked, "#c8e06a", 0],
                    ["debt", effectiveDebt, "#7dffa0", 0],
                    ["max draw", maxDraw, "#6ec8ff", 0],
                    ["debt cover", debtCoverPct, "#5a7dff", 1],
                  ] as const
                ).map(([k, v, c, decimals]) => (
                  <div key={k} className="flex items-center justify-between">
                    <dt className="text-[#9a9a9a]">{k}</dt>
                    <dd className="flex items-center gap-2">
                      {typeof v === "string" ? (
                        <span>{v}</span>
                      ) : (
                        <AnimatedNumber
                          value={v}
                          decimals={decimals ?? 0}
                          prefix={k === "locked" ? "" : k === "debt cover" ? "" : "$"}
                          suffix={k === "debt cover" ? "%" : k === "locked" ? " $STIO" : ""}
                        />
                      )}
                      <span
                        className="h-1 w-5 rounded-sm"
                        style={{ background: c }}
                      />
                    </dd>
                  </div>
                ))}
              </dl>

              <label className="mb-4 block">
                <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-[#9a9a9a]">
                  AMOUNT, USD-S
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-black px-3 focus-within:border-[#ccff00]/40">
                  <input
                    inputMode="decimal"
                    value={drawAmt}
                    onChange={(e) => setDrawAmt(e.target.value.replace(/[^\d.]/g, ""))}
                    placeholder="e.g. 1000"
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#5a5a5a]"
                  />
                  <button
                    type="button"
                    onClick={() => setDrawAmt(maxDraw > 0 ? String(Math.floor(maxDraw)) : "")}
                    className="shrink-0 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-[10px] tracking-wider text-[#cfcfcf]"
                  >
                    MAX
                  </button>
                </div>
              </label>

              <MetalButton className="w-full py-3">DRAW USD-S</MetalButton>
            </div>
          </div>
        )}

        {tab === "BREAK" && (
          <div className="mb-4 grid gap-4 lg:grid-cols-2">
            <div className="panel p-5 md:p-6">
              <div className="mb-1 text-xl tracking-wide">BUY BREAK</div>
              <div className="mb-5 text-[10px] tracking-[0.14em] text-[#ccff00]">
                FORM ST-03 · BOOK
              </div>
              <p className="mb-5 text-sm font-normal leading-relaxed text-[#cfcfcf]">
                Bet the Oath maker sells early. Your premium helps pay down
                their debt while they hold. On break, penalty routes to you and
                the pool.
              </p>
              <label className="mb-4 block">
                <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-[#9a9a9a]">
                  OATH ID
                </span>
                <input
                  value={oathId}
                  onChange={(e) => setOathId(e.target.value)}
                  placeholder="e.g. 184"
                  className="w-full rounded-xl border border-[#2a2a2a] bg-black px-3 py-3 text-sm outline-none placeholder:text-[#5a5a5a] focus:border-[#ccff00]/40"
                />
              </label>
              <label className="mb-5 block">
                <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-[#9a9a9a]">
                  PREMIUM, USD-S
                </span>
                <input
                  inputMode="decimal"
                  value={breakAmt}
                  onChange={(e) => setBreakAmt(e.target.value.replace(/[^\d.]/g, ""))}
                  placeholder="e.g. 250"
                  className="w-full rounded-xl border border-[#2a2a2a] bg-black px-3 py-3 text-sm outline-none placeholder:text-[#5a5a5a] focus:border-[#ccff00]/40"
                />
              </label>
              <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-3 text-sm">
                <div>
                  <div className="text-[9px] tracking-[0.12em] text-[#9a9a9a]">
                    PREMIUM / HR
                  </div>
                  <AnimatedNumber
                    value={premiumPerHour}
                    decimals={2}
                    prefix="$"
                    className="text-[#ccff00]"
                  />
                </div>
                <div>
                  <div className="text-[9px] tracking-[0.12em] text-[#9a9a9a]">
                    COVER
                  </div>
                  <AnimatedNumber
                    value={breakCover}
                    decimals={1}
                    suffix="%"
                    className="text-[#ccff00]"
                  />
                </div>
              </div>
              <MetalButton className="w-full py-3">BUY BREAK</MetalButton>
            </div>
            <div className="panel p-5 md:p-6">
              <div className="mb-4 text-[10px] tracking-[0.14em] text-[#ccff00]">
                LIVE BOOK
              </div>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
                  <dt className="text-[#9a9a9a]">open interest</dt>
                  <dd className="text-[#ccff00]">
                    <AnimatedNumber value={84200 + premium} decimals={0} prefix="$" />
                  </dd>
                </div>
                <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
                  <dt className="text-[#9a9a9a]">premium / hr</dt>
                  <dd className="text-[#ccff00]">
                    <AnimatedNumber value={420 + premiumPerHour} decimals={2} prefix="$" />
                  </dd>
                </div>
                <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
                  <dt className="text-[#9a9a9a]">top oath</dt>
                  <dd className="text-[#ccff00]">#{oathId || "184"}</dd>
                </div>
                <div className="flex justify-between border-b border-[#2a2a2a] pb-2">
                  <dt className="text-[#9a9a9a]">status</dt>
                  <dd className="text-[#7dffa0]">OPEN</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {(tab === "REPAY" || tab === "OATH") && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="panel p-5 md:p-6">
              <div className="mb-1 text-lg font-light tracking-[0.12em] text-white">
                TERM
              </div>
              <div className="mb-5 text-[10px] font-normal tracking-[0.16em] text-[#ccff00]">
                HOLD CLOCK · LIVE MATH
              </div>
              <dl className="mb-6 space-y-3 text-sm font-normal">
                <div className="flex items-center justify-between">
                  <dt className="text-[#9a9a9a]">premium inflow</dt>
                  <dd className="text-[#ccff00]">
                    <AnimatedNumber
                      instant
                      value={premiumPerHour * 24}
                      decimals={2}
                      prefix="$"
                      suffix="/d"
                    />
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#9a9a9a]">break cover</dt>
                  <dd className="text-[#ccff00]">
                    <AnimatedNumber instant value={breakCover} decimals={1} suffix="%" />
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#9a9a9a]">debt left</dt>
                  <dd className="text-[#ccff00]">
                    <AnimatedNumber instant value={effectiveDebt} decimals={0} prefix="$" />
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#9a9a9a]">days remaining</dt>
                  <dd className="text-[#ccff00]">
                    <AnimatedNumber instant value={termDays} decimals={0} min={0} />
                  </dd>
                </div>
              </dl>
              <div className="mb-1 flex items-center justify-between text-[10px] tracking-[0.12em] text-[#9a9a9a]">
                <span>TERM</span>
                <span>YEARS</span>
              </div>
              <input
                type="range"
                min={TERM_MIN_DAYS}
                max={TERM_MAX_DAYS}
                step={1}
                value={termDays}
                onChange={(e) => setTermDays(Number(e.target.value))}
                className="term-slider mb-3 w-full"
                style={{ ["--fill" as string]: sliderFill }}
                aria-label="Term length in days"
              />
              <div className="mb-4 flex items-baseline gap-2 text-2xl font-light text-[#ccff00]">
                <AnimatedNumber
                  instant
                  value={years}
                  decimals={2}
                  min={0}
                  className="inline-block min-w-[4.75ch]"
                />
                <span className="text-sm font-normal text-[#9a9a9a]">YEARS</span>
              </div>
              <p className="text-xs font-normal leading-relaxed text-[#9a9a9a]">
                Drag to set the Oath clock. Break premiums recalculate debt
                cover as the book turns.
              </p>
            </div>

            <div className="panel p-5 md:p-6">
              <div className="mb-1 text-xl tracking-wide">REPAY & CLOSE</div>
              <div className="mb-5 text-[10px] tracking-[0.14em] text-[#ccff00]">
                FORM ST-05 · SETTLEMENT
              </div>
              <label className="mb-4 block">
                <span className="mb-1.5 block text-[10px] tracking-[0.14em] text-[#9a9a9a]">
                  AMOUNT, USD-S
                </span>
                <div className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-black px-3 focus-within:border-[#ccff00]/40">
                  <input
                    inputMode="decimal"
                    value={repayAmt}
                    onChange={(e) => setRepayAmt(e.target.value.replace(/[^\d.]/g, ""))}
                    placeholder="e.g. 500"
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#5a5a5a]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setRepayAmt(debtBase > 0 ? String(Math.ceil(debtBase)) : "")
                    }
                    className="shrink-0 rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-[10px] tracking-wider text-[#cfcfcf]"
                  >
                    ALL
                  </button>
                </div>
              </label>
              <div className="mb-3 rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[10px] tracking-[0.12em] text-[#9a9a9a]">
                    AFTER REPAY
                  </span>
                  <AnimatedNumber
                    value={Math.max(0, effectiveDebt)}
                    decimals={0}
                    prefix="$"
                    className="text-[#ccff00]"
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-5 py-2.5 text-[11px] tracking-[0.12em]"
                >
                  APPROVE USD-S
                </button>
                <MetalButton>PAY</MetalButton>
              </div>
              <p className="mb-4 text-xs font-normal text-[#9a9a9a]">
                Close returns locked $STIO once debt is zero — or when the Oath
                is honored at term.
              </p>
              <button
                type="button"
                className="w-full rounded-xl border border-[#2a2a2a] py-3 text-[11px] tracking-[0.14em] text-[#9a9a9a] transition-colors hover:border-[#ccff00]/40 hover:text-white"
              >
                CLOSE OATH
              </button>
            </div>
          </div>
        )}

        {(tab === "BOOK" || tab === "DESK") && (
          <div className="panel p-6">
            <div className="mb-2 text-xl tracking-wide">
              {tab === "BOOK" ? "BREAK BOOK" : "DESK STATUS"}
            </div>
            <p className="mb-4 text-sm font-normal text-[#cfcfcf]">
              {tab === "BOOK"
                ? "Open Break interest across active Oaths. Premiums flow to debt paydown while makers hold."
                : "Window open. Caps apply. Contracts are the desk — unaudited until stated otherwise."}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["ACTIVE OATHS", 184 + Math.floor(locked / 5000), 0, ""],
                ["BREAK OI", 84200 + premium, 0, "$"],
                ["DEBT PAID DOWN", 2100000 + num(repayAmt), 0, "$"],
              ].map(([l, v, d, p]) => (
                <div
                  key={l as string}
                  className="rounded-xl border border-[#2a2a2a] bg-black px-4 py-3"
                >
                  <div className="text-[10px] tracking-[0.14em] text-[#9a9a9a]">
                    {l as string}
                  </div>
                  <AnimatedNumber
                    value={v as number}
                    decimals={d as number}
                    prefix={p as string}
                    className="text-xl text-[#ccff00]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[#2a2a2a] py-4 text-center text-[10px] tracking-[0.14em] text-[#9a9a9a]">
        STATIO DESK · $STIO · USD-S · CAPS APPLY
      </div>
    </div>
  );
}
