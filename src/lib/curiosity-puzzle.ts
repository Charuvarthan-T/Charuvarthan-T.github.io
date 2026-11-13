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
