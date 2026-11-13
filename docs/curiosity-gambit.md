# The Curiosity Gambit

An optional, session-scoped introduction to the existing portfolio. The approved
challenge is **White to move. Mate in 1.**

## Puzzle provenance and verification

The position is from Paul Morphy vs Duke of Brunswick and Count Isouard, Paris,
1858, after Black's 16th move. The published game score is on page 2 of
[C&O Family Chess Center's notation guide](https://chesscenter.net/files/NotationANOperaHse.pdf).

`pnpm test:gambit` reconstructs the complete game leading to this position with
chess.js, checks all 33 legal moves, proves there is exactly one immediate mate,
and checks illegal moves and attempts to play Black. The UI accepts any move
that chess.js verifies as checkmate, rather than matching a hardcoded square.
Incorrect moves preserve the starting position. The solution is not shown in
the introduction.

## Entry and escape behavior

- Native modal dialog isolates focus and pointer input from the existing page.
- Click/tap or pointer drag moves pieces. Arrow keys explore squares; Enter or
  Space selects a piece and destination. The board has one tab stop.
- Skip, the name link, and Escape always enter immediately, with a short fade.
- After the board is revealed, 5 seconds without pointer-down or keyboard activity
  opens the same final screen as a verified checkmate. Mouse movement alone
  does not restart the timer. Returning from a background tab also checks wall
  clock time, so throttled timers cannot strand the visitor.
- The final screen is terminal and identical for both outcomes, including the
  disabled starting board, sequential playful copy, and LET ME IN action. The
  skip button has a continuous, restrained glow while this screen is displayed.
- Entry is remembered in sessionStorage for this browser tab. Storage is optional;
  access still works when it is blocked. Direct anchor links bypass the gate.
- The gate is loaded after hydration, only on the home page for a new session.
  With no JavaScript, a failed gate import, or unsupported native dialogs, the
  existing page remains accessible. Portfolio metadata and routes are unchanged.
- On entry the dialog closes, body scrolling is restored, and focus moves to the
  existing main element. All timers and listeners are cleaned up on unmount.

## Design and assets

The gate uses locally bundled Absans Regular, existing semantic color tokens,
radius, Button, Framer Motion, and light/dark theme. The rest of the portfolio
retains Inter. Absans is loaded through next/font/local with font-display swap;
its unmodified WOFF2 and SIL Open Font License are in public/fonts/absans.

Initially only the full-width introduction is mounted. The title and three
supporting blocks reveal at 0, 0.95, 1.9, and 2.85 seconds. After a reading beat,
at 4.8 seconds the composition moves left and the board enters from the right.
The board is absent from the DOM and keyboard order before this transition.
Reduced motion shows the copy without animation, then enables the board on the
next timer tick. The 5-second idle clock starts when the board is revealed,
so the introduction does not consume the visitor's time to play.
The desktop supporting text is arranged horizontally; mobile uses a readable
single column with a sticky skip header. No visible SAN move notation is shown.
The only new package is `chess.js` 1.4.0. Chessnut SVG pieces by Alexis Luengas
are hosted locally under Apache 2.0; attribution and license accompany the files
in `public/chess`. Only the ten piece types present in the puzzle are included.
