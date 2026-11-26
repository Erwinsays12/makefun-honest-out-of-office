// main.ts — The Painfully Honest Out-of-Office
//
// Writes one brutally honest but still polite out-of-office auto-reply to
// /output/entry.txt. The entry is a single sentence of at most 200
// characters, judged on honesty first, then politeness, then turn of phrase.
//
// The program holds a shortlist of candidate replies and picks the best one
// with a small deterministic scorer that mirrors the judge's brief:
//   1. an explicit honesty cue ("honestly" / "to be honest"),
//   2. a private truth about the absence, workload or inbox,
//   3. a warm, professional politeness marker,
//   4. a quotable turn of phrase (a comparison or vivid image),
//   5. one sentence, 120-200 characters, no cramming, no trailing off.
//
// Deterministic: no network, no clock, no randomness, no environment input.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

const CANDIDATES: string[] = [
  "I'm away this week, honestly grateful to be unreachable, and I'll answer your email when I return — slowly and properly, because a rested reply beats the rushed one you'd get from me today.",
  "I'm out of office, and honestly, my inbox needed this break as much as I did; thank you for your patience, and I'll reply with a clear head instead of the hurried answer you'd get today.",
  "I'm out of the office, finally taking the break I kept insisting I didn't need; thank you for your patience — I'll reply properly when I'm back and can give your email the attention it deserves.",
  "I'm away until Monday, taking the time off I kept postponing because I was afraid of the inbox I'd return to; thank you for your patience — I'll answer properly once I'm rested enough to mean it.",
  "I'm out of the office and, to be honest, not checking email because I finally admitted I needed a real break; thank you for understanding, and I'll reply thoughtfully once I'm back.",
];

// Phrases the scorer looks for. Each list is worth points only when the
// phrase actually appears in the candidate, so the winner earns its place.
const HONESTY_CUES = ["honestly", "to be honest"];
const PRIVATE_TRUTHS = [
  "grateful to be unreachable",
  "inbox needed this break",
  "afraid of the inbox",
  "kept postponing",
  "kept insisting i didn't need",
  "finally admitted i needed",
];
const POLITENESS_MARKERS = [
  "thank you for your patience",
  "thank you for understanding",
  "properly",
  "thoughtfully",
  "attention it deserves",
];
const QUOTABLE_TURNS = [
  "as much as i did",
  "beats the rushed one",
  "clear head",
  "rested enough to mean it",
];

function isSingleSentence(text: string): boolean {
  const trimmed = text.trim();
  // Exactly one sentence-ending mark, and it is the final character.
  const enders = trimmed.match(/[.!?]/g) ?? [];
  return enders.length === 1 && /[.!?]$/.test(trimmed);
}

function score(text: string): number {
  const lower = text.toLowerCase();
  let points = 0;

  // Hard gate: the sealed scorer only accepts 1-200 characters, one
  // sentence, not only whitespace. Anything outside it cannot win.
  if (text.length < 1 || text.length > MAX_CHARS) return -1000;
  if (!isSingleSentence(text)) return -1000;
  if (text.trim().length === 0) return -1000;

  // 1. Explicit honesty cue.
  for (const cue of HONESTY_CUES) if (lower.includes(cue.toLowerCase())) points += 30;

  // 2. A private truth about the absence, workload or inbox.
  for (const truth of PRIVATE_TRUTHS) {
    if (lower.includes(truth.toLowerCase())) points += 25;
  }

  // 3. Warm, professional politeness.
  for (const marker of POLITENESS_MARKERS) {
    if (lower.includes(marker.toLowerCase())) points += marker.startsWith("thank you") ? 20 : 10;
  }

  // 4. A quotable turn of phrase.
  for (const turn of QUOTABLE_TURNS) if (lower.includes(turn.toLowerCase())) points += 25;

  // 5. Length fit: a full sentence that uses the room without cramming.
  if (text.length >= 150) points += 10;
  else if (text.length >= 120) points += 5;

  // Small penalty for piling on clause separators; a clean single
  // sentence should not read like a list of complaints.
  const separators = (text.match(/[;—]/g) ?? []).length;
  if (separators > 2) points -= 5 * (separators - 2);

  return points;
}

function pickBest(candidates: string[]): { text: string; points: number } {
  let best = { text: candidates[0], points: score(candidates[0]) };
  for (const candidate of candidates.slice(1)) {
    const points = score(candidate);
    // Strictly greater wins, so the earliest candidate wins any tie.
    if (points > best.points) best = { text: candidate, points };
  }
  return best;
}

const best = pickBest(CANDIDATES);

for (const candidate of CANDIDATES) {
  console.log(`${score(candidate)} pts | ${candidate.length} chars | ${candidate}`);
}
console.log(`\nWinner (${best.points} pts, ${best.text.length} chars): ${best.text}`);

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, best.text, "utf8");
console.log(`Wrote ${OUTPUT_PATH}`);
