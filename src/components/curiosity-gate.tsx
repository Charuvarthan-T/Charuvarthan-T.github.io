"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { Chess, type Square } from "chess.js";
import Image from "next/image";
import localFont from "next/font/local";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { PUZZLE_FEN, tryPuzzleMove, completePuzzleMate } from "@/lib/curiosity-puzzle";
import styles from "./curiosity-gate.module.css";
import KingDeparture, { type KingOrigin } from "./king-departure";

const IDLE_MS = 7_000;
// Four staggered reveals, followed by a reading beat before the board enters.
const INTRO_DURATION_MS = 4_800;
const absans = localFont({
  src: "../../public/fonts/absans/Absans-Regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  preload: false,
});
const FILES = "abcdefgh";
const PIECES = { k: "king", q: "queen", r: "rook", b: "bishop", n: "knight", p: "pawn" };
const squares = Array.from({ length: 64 }, (_, index) => `${FILES[index % 8]}${8 - Math.floor(index / 8)}` as Square);

function GuideArrow({ className }: { className: string }) {
  const mask = useId();
  const curve = "M4 12 C64 70 150 64 232 20";
  return <svg className={className} viewBox="0 0 240 80" fill="none" aria-hidden="true" focusable="false">
    <defs><mask id={mask}><path className={styles.guideDraw} pathLength="1" d={curve} stroke="white" strokeWidth="5" /></mask></defs>
    <path d={curve} stroke="currentColor" strokeWidth="1.3" strokeDasharray="3 6" strokeLinecap="round" mask={`url(#${mask})`} />
    <path className={styles.guideHead} d="M222 18 L233 20 L228 31" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

export default function CuriosityGate({ onEnter }: { onEnter: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [state, setState] = useState<"puzzle" | "final" | "mating" | "cinema">("puzzle");
  const [challengeVisible, setChallengeVisible] = useState(false);
  const [finalRead, setFinalRead] = useState(false);
  const [skipMentionVisible, setSkipMentionVisible] = useState(false);
  const [kingOrigin, setKingOrigin] = useState<KingOrigin | null>(null);
  const [fen, setFen] = useState(PUZZLE_FEN);
  const [selected, setSelected] = useState<Square | null>(null);
  const [focused, setFocused] = useState<Square>("d1");
  const [message, setMessage] = useState("Find the forced mate.");
  const [leaving, setLeaving] = useState(false);
  const [dragging, setDragging] = useState<Square | null>(null);
  const [attempt, setAttempt] = useState(0);
  const lastActivity = useRef(Date.now());
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();
  const exitTimer = useRef<ReturnType<typeof setTimeout>>();
  const drag = useRef<{ square: Square; x: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const game = new Chess(fen);
  const legal = selected ? game.moves({ square: selected, verbose: true }).map(move => move.to) : [];

  useEffect(() => {
    if (state !== "puzzle" || leaving) return;
    const timer = setTimeout(() => setChallengeVisible(true), reduce ? 0 : INTRO_DURATION_MS);
    return () => clearTimeout(timer);
  }, [state, leaving, reduce]);

  const enter = useCallback(() => {
    if (exitTimer.current) return;
    setLeaving(true);
    clearTimeout(idleTimer.current);
    exitTimer.current = setTimeout(() => {
      dialog.current?.close();
      onEnter();
    }, reduce ? 0 : 350);
  }, [onEnter, reduce]);

  useEffect(() => {
    const element = dialog.current;
    if (!element || typeof element.showModal !== "function") { onEnter(); return; }
    const previousOverflow = document.body.style.overflow;
    try { element.showModal(); } catch { onEnter(); return; }
    element.querySelector<HTMLButtonElement>("[data-skip]")?.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      clearTimeout(exitTimer.current);
    };
  }, [onEnter]);

  const finish = useCallback(() => {
    setState("final");
    setSelected(null);
    setFocused("d1");
    setDragging(null);
    drag.current = null;
    clearTimeout(idleTimer.current);
  }, []);

  const activity = useCallback(() => {
    lastActivity.current = Date.now();
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(finish, IDLE_MS);
  }, [finish]);

  useEffect(() => {
    if (state !== "puzzle" || !challengeVisible || leaving) return;
    activity();
    const resume = () => {
      if (Date.now() - lastActivity.current >= IDLE_MS) finish();
    };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("focus", resume);
    return () => {
      clearTimeout(idleTimer.current);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("focus", resume);
    };
  }, [state, challengeVisible, activity, leaving, finish]);

  // Last block finishes its stagger before the three-second reading hold.
  useEffect(() => {
    if (state !== "final" || finalRead || leaving) return;
    const fallback = setTimeout(() => setFinalRead(true), reduce ? 0 : 4_200);
    return () => clearTimeout(fallback);
  }, [state, finalRead, reduce, leaving]);

  useEffect(() => {
    if (state !== "final" || !finalRead || leaving) return;
    const hold = setTimeout(() => setState("mating"), 3_000);
    return () => clearTimeout(hold);
  }, [state, finalRead, leaving]);

  useEffect(() => {
    if (state !== "mating" || leaving) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    board.current?.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "center" });
    timers.push(setTimeout(() => {
      try {
        const matedFen = completePuzzleMate(fen);
        setFen(matedFen);
        timers.push(setTimeout(() => {
          // Verify again at the cinematic boundary: no decorative fake mate.
          if (!new Chess(matedFen).isCheckmate()) { enter(); return; }
          if (reduce) { enter(); return; }
          const rect = board.current?.querySelector<HTMLElement>("[data-black-king]")?.getBoundingClientRect();
          setKingOrigin(rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, size: rect.width } : { x: innerWidth / 2, y: innerHeight / 2, size: 40 });
          setState("cinema");
        }, reduce ? 0 : 1_050));
      } catch {
        // A failed effect must never block the portfolio.
        enter();
      }
    }, reduce ? 0 : 450));
    return () => timers.forEach(clearTimeout);
    // fen is captured at departure start. Its legal mating update must not
    // restart this effect and replay the move or cancel its completion timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, leaving, reduce, enter]);

  function move(from: Square, to: Square) {
    if (state !== "puzzle" || leaving) return;
    const result = tryPuzzleMove(fen, from, to);
    setSelected(null);
    if (!result.legal) {
      setMessage("Even curiosity has rules. Try a legal move.");
    } else if (!result.solved) {
      // Keep the original position after a legal but incorrect attempt.
      setMessage("Not quite. The king remains employed.");
      setAttempt(value => value + 1);
    } else {
      setFen(result.fen);
      setMessage("The king has left the building.");
      finish();
    }
  }

  function choose(square: Square) {
    if (suppressClick.current) { suppressClick.current = false; return; }
    if (state !== "puzzle") return;
    const piece = game.get(square);
    if (piece?.color === "w") {
      const next = selected === square ? null : square;
      setSelected(next);
      setMessage(next ? "Choose a destination." : "Find the forced mate.");
    } else if (selected) move(selected, square);
  }

  function keyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const directions: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -8, ArrowDown: 8, Home: -(index % 8), End: 7 - index % 8 };
    if (!(event.key in directions)) return;
    event.preventDefault();
    const next = index + directions[event.key];
    if (next < 0 || next > 63) return;
    if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && Math.floor(next / 8) !== Math.floor(index / 8)) return;
    setFocused(squares[next]);
    board.current?.querySelector<HTMLButtonElement>(`[data-square="${squares[next]}"]`)?.focus();
  }

  function pointerDown(event: PointerEvent<HTMLButtonElement>, square: Square) {
    if (event.button !== 0 || state !== "puzzle" || game.get(square)?.color !== "w") return;
    drag.current = { square, x: event.clientX, y: event.clientY, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function pointerMove(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current;
    if (!start) return;
    if (!start.moved && Math.hypot(event.clientX - start.x, event.clientY - start.y) < 7) return;
    start.moved = true;
    setDragging(start.square);
    const rect = board.current?.getBoundingClientRect();
    if (rect) { dragX.set(event.clientX - rect.left); dragY.set(event.clientY - rect.top); }
  }

  function pointerUp(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current;
    drag.current = null;
    setDragging(null);
    if (!start?.moved) return;
    suppressClick.current = true;
    const rect = board.current?.getBoundingClientRect();
    if (!rect || event.clientX < rect.left || event.clientX >= rect.right || event.clientY < rect.top || event.clientY >= rect.bottom) return;
    const column = Math.floor((event.clientX - rect.left) / rect.width * 8);
    const row = Math.floor((event.clientY - rect.top) / rect.height * 8);
    move(start.square, squares[row * 8 + column]);
  }

  const reveal = { initial: reduce ? false as const : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: reduce ? 0 : -8 }, transition: { duration: reduce ? 0 : 0.45 } };
  const sequence = (delay: number) => ({
    initial: reduce ? false as const : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0 : 0.7,
      delay: reduce ? 0 : delay,
      ease: [0.22, 1, 0.36, 1],
      // The entrance stagger must not delay the later layout movement.
      layout: { duration: reduce ? 0 : 0.9, delay: 0, ease: [0.22, 1, 0.36, 1] },
    },
  });
  const compositionTransition = { duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] };

  return (
    <dialog ref={dialog} className={`${styles.dialog} ${absans.className}`} data-cinematic={state === "cinema" ? "true" : undefined} aria-label={state === "cinema" ? "Opening portfolio" : undefined} aria-labelledby={state === "cinema" ? undefined : "curiosity-title"} onCancel={event => { event.preventDefault(); enter(); }} onPointerDownCapture={state === "puzzle" && challengeVisible ? activity : undefined} onKeyDownCapture={state === "puzzle" && challengeVisible ? activity : undefined}>
      <motion.div className={`${styles.shell} ${state === "cinema" ? styles.cinemaHidden : ""}`} initial={{ opacity: 0 }} animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: reduce ? 0 : 0.35 }}>
        <header className={styles.header}>
          <a className={styles.signature} href="#hero" onClick={event => { event.preventDefault(); enter(); }} aria-label="Enter Charuvarthan's portfolio">Charuvarthan<span aria-hidden="true">.</span></a>
          <div className={styles.skipAction}>
            <button data-skip className={`${styles.skip} ${state === "final" && skipMentionVisible ? styles.skipPulse : ""}`} onClick={enter}>Skip this nonsense <ArrowUpRight size={14} aria-hidden="true" /></button>
          </div>
        </header>

        <div className={`${styles.composition} ${challengeVisible ? styles.challengeLayout : styles.introLayout}`} data-phase={challengeVisible ? "challenge" : "intro"}>
          <motion.div layout={!reduce} className={styles.copy} transition={compositionTransition}>
            <AnimatePresence mode="wait">
              {state === "puzzle" ? (
                <motion.div key="intro" exit={{ opacity: 0, y: reduce ? 0 : -12 }} transition={{ duration: reduce ? 0 : 0.4 }}>
                  <motion.h1 layout={!reduce} {...sequence(0)} id="curiosity-title" className={styles.title}>The human urge to know.</motion.h1>
                  <div className={`${styles.body} ${styles.introSupporting}`}>
                    <motion.p layout="position" {...sequence(0.95)}>Came for the design?</motion.p>
                    <motion.p layout="position" {...sequence(1.9)} className={styles.interesting}>The work?</motion.p>
                    <motion.p layout="position" {...sequence(2.85)}>Or to know about me?</motion.p>
                  </div>
                  {challengeVisible && <motion.div className={styles.challengeNote} {...reveal}>
                    <em>Fancy a challenge?</em> Find mate in one.
                    <GuideArrow className={styles.boardGuide} />
                  </motion.div>}
                </motion.div>
              ) : (
                <motion.div key="final" data-final-screen {...reveal}>
                  <motion.h1 {...sequence(0)} id="curiosity-title" className={styles.title}>You know what?</motion.h1>
                  <div className={styles.finalSupporting}>
                    <motion.p {...sequence(0.95)}>Whether you solved the puzzle…<br />Or just waited it out…</motion.p>
                    <motion.p {...sequence(1.9)}>You just wasted 5 to 10 seconds of your life.<br />That was entirely optional.</motion.p>
                    <motion.p {...sequence(2.85)} onAnimationComplete={() => { setSkipMentionVisible(true); setFinalRead(true); }}>The skip button was right there.<br /><span className={styles.emphasis}>Well, since you&apos;ve committed…</span></motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {challengeVisible && <motion.div data-chess-challenge data-checkmated={game.isCheckmate() ? "true" : "false"} className={styles.puzzle} initial={reduce ? false : { opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0, scale: state === "mating" ? 0.94 : 1 }} transition={{ ...compositionTransition, delay: reduce ? 0 : 0.1 }}>
            <div className={styles.boardHeading}>
              <div><p className={styles.eyebrow}>the curiosity gambit</p><h2>{state !== "puzzle" ? "Curiosity wins." : "White to move. Mate in 1."}</h2></div>
            </div>
            <div className={`${styles.boardFrame} ${state !== "puzzle" && state !== "mating" ? styles.idleBoard : ""}`}>
              <div className={styles.board} ref={board} role="group" aria-label={game.isCheckmate() ? "Chessboard. Black is checkmated." : "Chessboard. White to move and checkmate in one move."}>
                {squares.map((square, index) => {
                  const piece = game.get(square);
                  const isSelected = selected === square;
                  return (
                    <button key={square} type="button" data-square={square} className={`${styles.square} ${(Math.floor(index / 8) + index % 8) % 2 ? styles.darkSquare : styles.lightSquare} ${isSelected ? styles.selected : ""}`} tabIndex={focused === square ? 0 : -1} aria-label={`${square}${piece ? `, ${piece.color === "w" ? "white" : "black"} ${PIECES[piece.type]}` : ", empty"}${legal.includes(square) ? ", legal destination" : ""}`} aria-pressed={isSelected} aria-disabled={state !== "puzzle"} onFocus={() => setFocused(square)} onClick={() => choose(square)} onKeyDown={event => keyDown(event, index)} onPointerDown={event => pointerDown(event, square)} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => { drag.current = null; setDragging(null); }}>
                      {index % 8 === 0 && <span className={styles.rank} aria-hidden="true">{square[1]}</span>}
                      {index >= 56 && <span className={styles.file} aria-hidden="true">{square[0]}</span>}
                      {piece && <motion.span data-black-king={piece.color === "b" && piece.type === "k" ? "true" : undefined} data-color={piece.color} className={`${styles.piece} ${dragging === square ? styles.dragSource : ""}`} layoutId={`piece-${piece.color}-${piece.type}-${piece.color === "w" && piece.type === "r" && square === "d8" ? "d1" : square}`} transition={{ duration: reduce ? 0 : 0.3 }}><Image src={`/chess/${piece.color}${piece.type.toUpperCase()}.svg`} alt="" width={80} height={80} draggable={false} unoptimized /></motion.span>}
                      {legal.includes(square) && <span className={piece ? styles.capture : styles.destination} aria-hidden="true" />}
                    </button>
                  );
                })}
                {dragging && <motion.div className={styles.dragPiece} style={{ x: dragX, y: dragY }} aria-hidden="true"><Image src={`/chess/w${game.get(dragging)!.type.toUpperCase()}.svg`} alt="" width={80} height={80} unoptimized /></motion.div>}
              </div>
            </div>
            <div className={styles.boardFooter}>
              <p className={styles.feedback} role="status" aria-live="polite" aria-atomic="true" key={`${state}-${attempt}`}>{state !== "puzzle" ? "Go on, the choice was always yours" : message}</p>
              {selected && state === "puzzle" && <button className={styles.deselect} onClick={() => { setSelected(null); setMessage("Find the forced mate."); }} aria-label="Clear selected piece"><RotateCcw size={14} aria-hidden="true" /></button>}
            </div>
          </motion.div>}
        </div>

      </motion.div>
      {state === "cinema" && kingOrigin && <KingDeparture origin={kingOrigin} onComplete={enter} onSkip={enter} leaving={leaving} />}
    </dialog>
  );
}
