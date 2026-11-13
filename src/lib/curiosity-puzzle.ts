import { Chess, type Square } from "chess.js";

// Morphy vs Duke of Brunswick & Count Isouard, Paris 1858, after 16...Nxb8.
// Published score: https://chesscenter.net/files/NotationANOperaHse.pdf (page 2).
export const PUZZLE_FEN = "1n2kb1r/p4ppp/4q3/4p1B1/4P3/8/PPP2PPP/2KR4 w k - 0 17";

export function tryPuzzleMove(fen: string, from: Square, to: Square) {
  const game = new Chess(fen);
  try {
    const move = game.move({ from, to, promotion: "q" });
    return { legal: true, solved: game.isCheckmate(), fen: game.fen(), move };
  } catch {
    return { legal: false, solved: false, fen, move: null };
  }
}

// Used by the timeout path. Only a legal move that actually ends the game is
// accepted; an already checkmated position is preserved exactly as played.
export function completePuzzleMate(fen: string) {
  const game = new Chess(fen);
  if (game.isCheckmate() && game.turn() === "b") return game.fen();
  if (game.turn() !== "w") throw new Error("Expected White to deliver mate");
  for (const move of game.moves({ verbose: true })) {
    game.move(move);
    if (game.isCheckmate() && game.turn() === "b") return game.fen();
    game.undo();
  }
  throw new Error("No legal mate in one from this position");
}
