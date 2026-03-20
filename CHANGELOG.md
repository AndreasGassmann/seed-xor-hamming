# 1.0.0

- Migrated to ESM (`"type": "module"`)
- Updated all dependencies (`seed-xor` 1.0.0, `@noble/hashes` 2.0.1, TypeScript 5, ESLint 10, Prettier 3)
- Fixed deterministic entropy generation to use double SHA-256 and binary concatenation (aligned with seed-xor and Coldcard firmware)
- Replaced tape/nyc with vitest
- Replaced legacy ESLint config with flat config
- Added all 12 test vectors from the reference implementation
- Added seed-xor XOR compatibility tests
- Removed `utils.ts` — reuses utilities from `seed-xor`
- Updated CI workflow (Node 24, actions v4)
- Added npm publish workflow
- Requires Node.js >= 20.19.0

# 0.0.1

Initial implementation of [Hamming Backups](https://cp4space.hatsya.com/2021/09/10/hamming-backups-a-2-of-3-variant-of-seedxor/)
