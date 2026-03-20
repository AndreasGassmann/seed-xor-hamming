# Hamming Backups: 2-of-3 variant of SeedXOR

[![GitHub Action](https://github.com/AndreasGassmann/seed-xor-hamming/workflows/Build%20and%20Test/badge.svg)](https://github.com/AndreasGassmann/seed-xor-hamming/actions?query=workflow%3A%22Build+and+Test%22+branch%3Amain)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/v/seed-xor-hamming.svg?colorB=brightgreen)](https://www.npmjs.com/package/seed-xor-hamming)

TypeScript/JavaScript implementation of [Hamming Backups](https://cp4space.hatsya.com/2021/09/10/hamming-backups-a-2-of-3-variant-of-seedxor/): A 2-of-3 variant of SeedXOR.

## Description

Seed XOR allows you to split up your BIP-39 seed phrase into multiple parts. The parts can then be used to reconstruct the original seed.

One shortcoming of SeedXOR is that you need all shares to recover the original mnemonic. Hamming Backups are a variant of SeedXOR that allow the original seed to be restored if only **2 out of 3 shares** are available. Only 24-word mnemonics are supported.

Read more about the concepts behind SeedXOR on the official website: [seedxor.com](https://seedxor.com)

## Installation

```
npm install seed-xor-hamming
```

Requires Node.js >= 20.19.0. This package is ESM-only.

## Example

```typescript
import { combine, split } from 'seed-xor-hamming';

const original =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';

const [share1, share2, share3] = await split(original, true);

console.log('Share 1:', share1);
console.log('Share 2:', share2);
console.log('Share 3:', share3);

const recovered = await combine(share1, share2); // Any 2 shares can be used

// The result is a tuple of 2 mnemonics: the original seed and the missing third share.
// The position depends on the input order. If you're unsure, just try both.
console.log('Recovered:', recovered);
```

For more examples, check the [examples](/examples/) folder or the [tests](/test/).

## Documentation

This library exports two methods, `split` and `combine`.

#### Split

`split` is used to split an existing 24-word seed into 3 shares. It takes 2 parameters:

`split(mnemonic: string, useRandom = false): Promise<[string, string, string]>`

- `mnemonic`: The seed that should be split. Must be a valid 24-word BIP-39 mnemonic.
- `useRandom`: If `true`, shares are generated randomly (different each time). If `false` (default), shares are generated deterministically (same seed always produces the same shares).

#### Combine

`combine` is used to combine Hamming Backup shares and reconstruct the original seed phrase. **You need 2 out of 3 shares to recover your seed phrase.**

`combine(share1: string, share2: string): Promise<[string, string]>`

- `share1`: One of the Hamming Backup shares.
- `share2`: Another one of the Hamming Backup shares.

The result is a tuple of two mnemonics. One of them is the original seed, and the other is the missing third share. **The position depends on the order of the inputs** — there is no way to know which element is the original seed and which is the third share without additional context (e.g., by recognizing your original seed). This is an inherent property of the Hamming Backup algorithm. If you're unsure about the order, try both of the recovered seeds.

## Testing

```bash
npm install
npm test
```

Test vectors are sourced from:

- [Hamming Backups reference implementation](https://gitlab.com/apgoucher/hamming-backups)
- [Coldcard firmware documentation](https://github.com/Coldcard/firmware/blob/master/docs/seed-xor.md)

## Dependencies

We try to use only a minimal set of dependencies to reduce the attack surface of malicious code being added by one of those dependencies.

There are only 3 (non-dev) dependencies:

- [bip39](https://www.npmjs.com/package/bip39) (by [bitcoinjs](https://github.com/bitcoinjs))
- [@noble/hashes](https://www.npmjs.com/package/@noble/hashes) (by [paulmillr](https://github.com/paulmillr/noble-hashes))
- [seed-xor](https://www.npmjs.com/package/seed-xor) (by [AndreasGassmann](https://github.com/AndreasGassmann/seed-xor))

## Usages

Currently, the following wallets support or are working on integrating Hamming Backups:

- [AirGap Vault (planned)](https://github.com/airgap-it/airgap-vault)

## Credits

The original idea for the [2-of-3 Hamming Backups](https://cp4space.hatsya.com/2021/09/10/hamming-backups-a-2-of-3-variant-of-seedxor/) came from Adam P. Goucher. He created a [reference implementation](https://gitlab.com/apgoucher/hamming-backups) in Python. Most of this package's code is based on the reference implementation.

The project setup has been inspired by multiple bitcoinjs libraries, such as [bip39](https://www.npmjs.com/package/bip39) and [bip85](https://www.npmjs.com/package/bip85).

## LICENSE

MIT
