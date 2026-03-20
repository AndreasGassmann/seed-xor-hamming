import { test, expect } from 'vitest';
import { split, combine } from '../ts_src/index.js';
import { combine as combineSeedXor } from 'seed-xor';
import { xor_lists, hammingBackup } from '../ts_src/hamming-backup.js';

// Reference test vectors from: https://gitlab.com/apgoucher/hamming-backups/-/blob/master/test_vectors.py

// here, X represents the 'original secret' seed phrase.
const X =
  'useless theme rescue solve stable idea render cotton run round fiscal push correct fish frown miss endless floor nasty wild squirrel long process vacant';

// A, B, and C are the three parts of a Hamming backup of X.
// A was generated randomly; (B, C) were computed from (X, A).
const A =
  'eight camera discover pink leg picture color afford cheap flip panel coffee damage open seminar hood park roof indoor merge female honey rack blossom';
const B =
  'door umbrella path easily note educate snow inject payment retire loyal stand major novel stairs tower topple minute ancient soul elite grit glory harvest';
const C =
  'wasp clutch circle common demand naive file doll deliver family erode finish limit fortune engage allow art hurdle trim save soon marriage joy loyal';

// All 12 hamming_backup assertions from reference implementation
test('hamming_backup(X, A) == (B, C)', () => {
  expect(hammingBackup(X, A)).toEqual([B, C]);
});

test('hamming_backup(X, B) == (C, A)', () => {
  expect(hammingBackup(X, B)).toEqual([C, A]);
});

test('hamming_backup(X, C) == (A, B)', () => {
  expect(hammingBackup(X, C)).toEqual([A, B]);
});

test('hamming_backup(A, X) == (C, B)', () => {
  expect(hammingBackup(A, X)).toEqual([C, B]);
});

test('hamming_backup(B, X) == (A, C)', () => {
  expect(hammingBackup(B, X)).toEqual([A, C]);
});

test('hamming_backup(C, X) == (B, A)', () => {
  expect(hammingBackup(C, X)).toEqual([B, A]);
});

test('hamming_backup(A, B) == (X, C)', () => {
  expect(hammingBackup(A, B)).toEqual([X, C]);
});

test('hamming_backup(B, C) == (X, A)', () => {
  expect(hammingBackup(B, C)).toEqual([X, A]);
});

test('hamming_backup(C, A) == (X, B)', () => {
  expect(hammingBackup(C, A)).toEqual([X, B]);
});

test('hamming_backup(B, A) == (C, X)', () => {
  expect(hammingBackup(B, A)).toEqual([C, X]);
});

test('hamming_backup(C, B) == (A, X)', () => {
  expect(hammingBackup(C, B)).toEqual([A, X]);
});

test('hamming_backup(A, C) == (B, X)', () => {
  expect(hammingBackup(A, C)).toEqual([B, X]);
});

// Split and combine tests

test('create deterministic shares', async () => {
  const [share1, share2, share3] = await split(X, false);

  expect(share1).toBe(
    'amateur casual mention match shed absurd dog whisper stick distance final rival fat cushion debris tenant disagree rude hard time junior void trust federal',
  );
  expect(share2).toBe(
    'gold draw upon sure rate tonight ritual toilet left enemy believe brief shrimp neglect giant slogan game chimney grant course robust abandon pride toe',
  );
  expect(share3).toBe(
    'negative limb spot order pigeon nominee equal civil blind sketch between avocado pill volume affair odor choose snow panic chimney balcony iron trim enroll',
  );

  const pair1 = await combine(share1, share2);
  const pair2 = await combine(share1, share3);
  const pair3 = await combine(share2, share1);
  const pair4 = await combine(share2, share3);
  const pair5 = await combine(share3, share1);
  const pair6 = await combine(share3, share2);

  expect(pair1).toContain(X);
  expect(pair2).toContain(X);
  expect(pair3).toContain(X);
  expect(pair4).toContain(X);
  expect(pair5).toContain(X);
  expect(pair6).toContain(X);
});

test('create random shares and reconstruct', async () => {
  const [share1, share2, share3] = await split(X, true);
  const pair1 = await combine(share1, share2);
  const pair2 = await combine(share1, share3);

  expect(pair1).toContain(X);
  expect(pair2).toContain(X);
});

test('should combine shares correctly', async () => {
  expect(await combine(A, B)).toEqual([X, C]);
  expect(await combine(B, C)).toEqual([X, A]);
  expect(await combine(C, A)).toEqual([X, B]);
  expect(await combine(B, A)).toEqual([C, X]);
  expect(await combine(C, B)).toEqual([A, X]);
  expect(await combine(A, C)).toEqual([B, X]);
});

// Seed-XOR compatibility tests

test('use seedxor to hamming backup', async () => {
  expect(await combineSeedXor([A, B, C])).toBe(X);
  expect(await combineSeedXor([A, C, B])).toBe(X);
  expect(await combineSeedXor([B, A, C])).toBe(X);
  expect(await combineSeedXor([B, C, A])).toBe(X);
  expect(await combineSeedXor([C, A, B])).toBe(X);
  expect(await combineSeedXor([C, B, A])).toBe(X);
});

// Additional 24-word test vectors from seed-xor / Coldcard docs
const DOCS_COMBINED =
  'silent toe meat possible chair blossom wait occur this worth option bag nurse find fish scene bench asthma bike wage world quit primary indoor';

const TUTORIAL_COMBINED =
  'gain series drill glad laugh online that witness daring enough arm anger benefit honey convince cool fortune pigeon leg shallow evoke room hat knock';

const ZERO_24 =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';

const ONES_24 =
  'zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo vote';

const LOCAL_TEST_24_COMBINED =
  'shift ivory empty runway path enhance pony wisdom pair absorb dinner enhance oval dove achieve soldier wing annual zebra brother consider social glance pole';

test('split and recover Coldcard docs seed', async () => {
  const [share1, share2, share3] = await split(DOCS_COMBINED, true);

  expect(await combine(share1, share2)).toContain(DOCS_COMBINED);
  expect(await combine(share2, share3)).toContain(DOCS_COMBINED);
  expect(await combine(share3, share1)).toContain(DOCS_COMBINED);

  expect(await combineSeedXor([share1, share2, share3])).toBe(DOCS_COMBINED);
});

test('split and recover Coldcard tutorial seed', async () => {
  const [share1, share2, share3] = await split(TUTORIAL_COMBINED, true);

  expect(await combine(share1, share2)).toContain(TUTORIAL_COMBINED);
  expect(await combine(share2, share3)).toContain(TUTORIAL_COMBINED);
  expect(await combine(share3, share1)).toContain(TUTORIAL_COMBINED);

  expect(await combineSeedXor([share1, share2, share3])).toBe(
    TUTORIAL_COMBINED,
  );
});

test('split and recover zero seed', async () => {
  const [share1, share2, share3] = await split(ZERO_24, true);

  expect(await combine(share1, share2)).toContain(ZERO_24);
  expect(await combine(share2, share3)).toContain(ZERO_24);
  expect(await combine(share3, share1)).toContain(ZERO_24);

  expect(await combineSeedXor([share1, share2, share3])).toBe(ZERO_24);
});

test('split and recover ones seed', async () => {
  const [share1, share2, share3] = await split(ONES_24, true);

  expect(await combine(share1, share2)).toContain(ONES_24);
  expect(await combine(share2, share3)).toContain(ONES_24);
  expect(await combine(share3, share1)).toContain(ONES_24);

  expect(await combineSeedXor([share1, share2, share3])).toBe(ONES_24);
});

test('split and recover additional seed', async () => {
  const [share1, share2, share3] = await split(LOCAL_TEST_24_COMBINED, true);

  expect(await combine(share1, share2)).toContain(LOCAL_TEST_24_COMBINED);
  expect(await combine(share2, share3)).toContain(LOCAL_TEST_24_COMBINED);
  expect(await combine(share3, share1)).toContain(LOCAL_TEST_24_COMBINED);

  expect(await combineSeedXor([share1, share2, share3])).toBe(
    LOCAL_TEST_24_COMBINED,
  );
});

// Error cases

test('fail if xor lists are not same length', () => {
  expect(() => {
    xor_lists([1], [2, 3]);
  }).toThrow();
});

test('fail if called with invalid mnemonic', async () => {
  await expect(split('abandon')).rejects.toThrow();
});

test('fail if seed is invalid length (12 words)', async () => {
  await expect(
    split(
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    ),
  ).rejects.toThrow();
});

test('fail if share is invalid length (12 words)', async () => {
  await expect(
    combine(
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    ),
  ).rejects.toThrow();
});

test('fail if share is invalid mnemonic', async () => {
  await expect(
    combine(
      'abandon',
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    ),
  ).rejects.toThrow();
});
