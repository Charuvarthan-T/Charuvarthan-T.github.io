// Run with `pnpm test:gambit`. No chess engine or additional test dependency.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const { Chess } = require("chess.js");
const source = fs.readFileSync(require.resolve("../src/lib/curiosity-puzzle.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const loaded = { exports: {} };
new Function("require", "module", "exports", compiled.outputText)(require, loaded, loaded.exports);
const { PUZZLE_FEN, tryPuzzleMove } = loaded.exports;

// Reconstruct the published game to prove the position is reachable, not invented.
const game = new Chess();
const score = "e4 e5 Nf3 d6 d4 Bg4 dxe5 Bxf3 Qxf3 dxe5 Bc4 Nf6 Qb3 Qe7 Nc3 c6 Bg5 b5 Nxb5 cxb5 Bxb5+ Nbd7 O-O-O Rd8 Rxd7 Rxd7 Rd1 Qe6 Bxd7+ Nxd7 Qb8+ Nxb8";
score.split(" ").forEach(move => game.move(move));
assert.equal(game.fen(), PUZZLE_FEN);
assert.equal(game.turn(), "w");
assert.equal(game.isCheck(), false);
assert.equal(game.isGameOver(), false);

// Exhaust every legal move. Any mate is accepted; every other move stays unsolved.
const legal = game.moves({ verbose: true });
const mates = [];
for (const move of legal) {
  game.move(move);
  const expected = game.isCheckmate();
  const result = tryPuzzleMove(PUZZLE_FEN, move.from, move.to);
  assert.equal(result.legal, true);
  assert.equal(result.solved, expected, move.san);
  if (expected) {
    assert.equal(game.turn(), "b");
    assert.equal(game.moves().length, 0);
    mates.push(move.san);
  }
  game.undo();
}
assert.deepEqual(mates, ["Rd8#"]);
assert.deepEqual(tryPuzzleMove(PUZZLE_FEN, "d1", "e3"), { legal: false, solved: false, fen: PUZZLE_FEN, move: null });
assert.equal(tryPuzzleMove(PUZZLE_FEN, "e8", "e7").legal, false, "Visitor cannot play Black");
assert.equal(game.fen(), PUZZLE_FEN, "Verification must not mutate the puzzle");
console.log(`Verified published position, ${legal.length} legal moves, one mate in one, and illegal-move rejection.`);
