// Run with `pnpm test:gambit`. No chess engine or additional test dependency.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const { Chess } = require("chess.js");
const source = fs.readFileSync(require.resolve("../src/lib/curiosity-puzzle.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const loaded = { exports: {} };
new Function("require", "module", "exports", compiled.outputText)(require, loaded, loaded.exports);
const { PUZZLE_FEN, tryPuzzleMove, completePuzzleMate } = loaded.exports;

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
const timeoutMate = completePuzzleMate(PUZZLE_FEN);
assert.equal(timeoutMate, tryPuzzleMove(PUZZLE_FEN, "d1", "d8").fen);
const mated = new Chess(timeoutMate);
assert.equal(mated.isCheckmate(), true);
assert.equal(mated.moves().length, 0);
assert.equal(mated.get("e8").type, "k", "The king stays on its real square");
assert.equal(completePuzzleMate(timeoutMate), timeoutMate, "Preserve the visitor's actual checkmate");
assert.throws(() => completePuzzleMate(new Chess().fen()), /No legal mate/);
assert.throws(() => completePuzzleMate(new Chess().fen().replace(" w ", " b ")), /Expected White/);
const shardSource = fs.readFileSync(require.resolve("../src/lib/glass-shards.ts"), "utf8");
const shardModule = { exports: {} };
new Function("require", "module", "exports", ts.transpileModule(shardSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(require, shardModule, shardModule.exports);
for (const mobile of [false, true]) {
  const shards = shardModule.exports.buildGlassShards(mobile);
  assert.deepEqual(shards, shardModule.exports.buildGlassShards(mobile), "Fractures must be deterministic");
  let area = 0;
  for (const shard of shards) {
    assert(shard.width > 0 && shard.height > 0);
    assert(!shard.clip.includes("NaN"));
    let twiceArea = 0;
    shard.points.forEach((point, index) => {
      assert(point.x >= -1e-7 && point.x <= 1 + 1e-7 && point.y >= -1e-7 && point.y <= 1 + 1e-7);
      const next = shard.points[(index + 1) % shard.points.length];
      twiceArea += point.x * next.y - next.x * point.y;
    });
    area += Math.abs(twiceArea) / 2;
  }
  assert(Math.abs(area - 1) < 1e-6, "The assembled shards must cover the entire king image exactly");
  assert(new Set(shards.map(shard => shard.points.length)).size > 1, "Use irregular glass cells, not a uniform tile grid");
}
console.log(`Verified published position, ${legal.length} legal moves, unique mate, legal timeout sequence, preserved solved position, and invalid-sequence rejection.`);
console.log("Verified deterministic desktop/mobile fracture geometry and complete image coverage.");
