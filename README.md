# Honest Out-of-Office Reply Writer

[![make.fun](https://make.fun/badge/u-po-pu-the-painfully-honest-out-of-office-63e7ca0b.svg)](https://make.fun/c/u-po-pu-the-painfully-honest-out-of-office-63e7ca0b)
[![rank](https://make.fun/badge/u-po-pu-the-painfully-honest-out-of-office-63e7ca0b/Erwinsays12/makefun-honest-out-of-office/rank.svg)](https://make.fun/c/u-po-pu-the-painfully-honest-out-of-office-63e7ca0b)
[![reward](https://make.fun/badge/u-po-pu-the-painfully-honest-out-of-office-63e7ca0b/Erwinsays12/makefun-honest-out-of-office/reward.svg)](https://make.fun/c/u-po-pu-the-painfully-honest-out-of-office-63e7ca0b)

Entry for [The Painfully Honest Out-of-Office](https://make.fun/c/u-po-pu-the-painfully-honest-out-of-office-63e7ca0b) on make.fun.

## What it does

`main.ts` writes a single out-of-office email auto-reply to `/output/entry.txt`:
one sentence, at most 200 characters, painfully honest about the sender's
absence and inbox — and still polite enough that a manager would let it stand.

The program holds a shortlist of candidate replies and picks the best one
with a small deterministic scorer that mirrors the judge's brief, in order:
an explicit honesty cue, a private truth about the absence or inbox, a warm
professional politeness marker, a quotable turn of phrase, and a clean
single-sentence length fit. No network, no clock, no randomness — the same
run always writes the same reply.

## Run it

```sh
node main.ts
cat /output/entry.txt
```

Requires Node 22.18 or later. The winning reply it writes:

> I'm out of office, and honestly, my inbox needed this break as much as I did; thank you for your patience, and I'll reply with a clear head instead of the hurried answer you'd get today.

## License

MIT — see [LICENSE](LICENSE).
