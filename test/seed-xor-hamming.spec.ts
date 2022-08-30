import { split, combine } from '../ts_src';
import { combine as combineSeedXor } from 'seed-xor';
import * as tape from 'tape';
import { xor_lists } from '../ts_src/hamming-backup';

// https://github.com/Coldcard/firmware/blob/1c47b073fc933b2e216d73c980db9d3231b8dd30/docs/seed-xor.md#xor-seed-example-using-3-parts

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

tape('create deterministic shares', async (t) => {
  const [share1, share2, share3] = await split(X, false);

  t.equal(
    share1,
    'tongue put trade devote raise acoustic young opera puppy athlete earn gather obvious joke badge weapon drastic draft gossip shy drink hero vacuum fire',
  );
  t.equal(
    share2,
    'era license prevent enable river box ancient pond dirt trade bundle slush ceiling bonus army lend clip climb surprise explain science cover rich couch',
  );
  t.equal(
    share3,
    'flag soup wink rocket subway happy dove arrange combine female arrive action mimic custom domain apology camera crime color hire expect suit time offer',
  );

  const pair1 = await combine(share1, share2);
  const pair2 = await combine(share1, share3);
  const pair3 = await combine(share2, share1);
  const pair4 = await combine(share2, share3);
  const pair5 = await combine(share3, share1);
  const pair6 = await combine(share3, share2);

  t.true(pair1.includes(X));
  t.true(pair2.includes(X));
  t.true(pair3.includes(X));
  t.true(pair4.includes(X));
  t.true(pair5.includes(X));
  t.true(pair6.includes(X));

  t.end();
});

tape('create random shares and reconstruct', async (t) => {
  const [share1, share2, share3] = await split(X, true);
  const pair1 = await combine(share1, share2);
  const pair2 = await combine(share1, share3);

  t.true(pair1.includes(X));
  t.true(pair2.includes(X));

  t.end();
});

tape('should combine shares correctly', async (t) => {
  t.deepEqual(await combine(A, B), [X, C]);
  t.deepEqual(await combine(B, C), [X, A]);
  t.deepEqual(await combine(C, A), [X, B]);
  t.deepEqual(await combine(B, A), [C, X]);
  t.deepEqual(await combine(C, B), [A, X]);
  t.deepEqual(await combine(A, C), [B, X]);

  t.end();
});

tape('use seedxor to hamming backup', async (t) => {
  t.equal(await combineSeedXor([A, B, C]), X);
  t.equal(await combineSeedXor([A, C, B]), X);
  t.equal(await combineSeedXor([B, A, C]), X);
  t.equal(await combineSeedXor([B, C, A]), X);
  t.equal(await combineSeedXor([C, A, B]), X);
  t.equal(await combineSeedXor([C, B, A]), X);

  t.end();
});

tape('fail if xor lists are not same length', async (t) => {
  t.plan(1);

  t.throws(() => {
    xor_lists([1], [2, 3]);
    t.end();
  });
});

tape('fail if called with invalid number of shares', async (t) => {
  t.plan(1);

  split('abandon').catch(() => {
    t.pass();
    t.end();
  });
});

tape('fail if seed is invalid length', async (t) => {
  t.plan(1);

  split(
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  ).catch(() => {
    t.pass();
    t.end();
  });
});

tape('fail if share is invalid length', async (t) => {
  t.plan(1);

  combine(
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  ).catch(() => {
    t.pass();
    t.end();
  });
});

tape('fail if share is invalid length', async (t) => {
  t.plan(1);

  combine(
    'abandon',
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  ).catch(() => {
    t.pass();
    t.end();
  });
});
