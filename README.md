# Hamming Backups: 2-of-3 variant of SeedXOR

[![GitHub Action](https://github.com/AndreasGassmann/seed-xor-hamming/workflows/Build%2C%20Test%20and%20Analyze/badge.svg)](https://github.com/AndreasGassmann/seed-xor-hamming/actions?query=workflow%3A%22Build%2C+Test+and+Analyze%22+branch%3Amain)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AndreasGassmann_seed-xor-hamming&metric=alert_status)](https://sonarcloud.io/dashboard?id=AndreasGassmann_seed-xor-hamming)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=AndreasGassmann_seed-xor-hamming&metric=coverage)](https://sonarcloud.io/dashboard?id=AndreasGassmann_seed-xor-hamming)
[![npm](https://img.shields.io/npm/v/seed-xor-hamming.svg?colorB=brightgreen)](https://www.npmjs.com/package/seed-xor-hamming)

TypeScript/JavaScript implementation of [Hamming Backups](https://cp4space.hatsya.com/2021/09/10/hamming-backups-a-2-of-3-variant-of-seedxor/): A 2-of-3 variant of SeedXOR.

# DISCLAIMER

This project is in an early development phase and has not been audited or reviewed. Use it at your own risk.

## Description

Seed XOR allows you to split up your seed into multiple parts. The parts can then be used to reconstruct the original seed.

Read more about the concepts behind SeedXOR on the official website: [Seed XOR](https://seedxor.com)

One shortcoming of SeedXOR is that you need all shares to recover the original mnemonic. Hamming Backups are a variant of SeedXOR that allow the original seed to be restored if only **2 out of 3 shares** are available.

## Installation

```
npm install seed-xor-hamming
```

## Example

```typescript
import { combine, split } from 'seed-xor-hamming';

const original =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';

(async () => {
  console.log('Original:', original);

  const [share1, share2, share3] = await split(original, true);

  console.log('Share 1:', share1);
  console.log('Share 2:', share2);
  console.log('Share 3:', share3);

  const recovered = await combine(share1, share2); // Any 2 shares can be used

  // The result will be an array of 2 mnemonics. One of them is the original seed.
  console.log('Recovered:', recovered);
})();
```

For more examples, check the [examples](/examples/) folder or the [tests](/test/).

## Documentation

This library exports two methods, `split` and `combine`.

#### Split

`split` is used to split an existing seed into multiple shares. It takes 3 parameters:

`split(mnemonic: string, useRandom = false): Promise<[string, string, string]>`

`mnemonic`: The seed that should be split.
`useRandom`: If set to true, the shares will be generated randomly. This means that if you create a Hamming Backup with the same seed multiple times, you will get **different** shares. If set to false, you will always get the same shares.

#### Combine

`combine` is used to combine Hamming Backup shares and reconstruct the original seed phrase. **You need 2 out of 3 shares to recover your seed phrase**.

`split(share1: string, share2: string): Promise<string>`

`share1`: One of the Hamming Backup shares.
`share2`: Another one of the Hamming Backup shares.

## Testing

```bash

npm install
npm test

---------------------|---------|----------|---------|---------|-------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------|---------|----------|---------|---------|-------------------
All files            |     100 |      100 |     100 |     100 |
 hamming-backup.ts   |     100 |      100 |     100 |     100 |
 index.ts            |     100 |      100 |     100 |     100 |
 seed-xor-hamming.ts |     100 |      100 |     100 |     100 |
 utils.ts            |     100 |      100 |     100 |     100 |
---------------------|---------|----------|---------|---------|-------------------
```

## TODOs

- [ ] Fix sonarsource coverage not working
- [ ] Audit/review of library by 3rd party

## Dependencies

We try to use only a minimal set of dependencies to reduce the attack surface of malicious code being added by one of those dependencies.

There are only 3 (non-dev) dependencies:

- [bip39](https://www.npmjs.com/package/bip39)
- [create-hash](https://www.npmjs.com/package/create-hash)
- [seed-xor](https://www.npmjs.com/package/seed-xor)

1 of those repositories is owned by the [bitcoinjs](https://github.com/bitcoinjs) organization, one of them is managed by [crypto-browserify](https://github.com/crypto-browserify), and one is created by the same author as the `seed-xor-hamming` package, [seed-xor](https://github.com/AndreasGassmann/seed-xor)

## Usages

Currently, the following wallets support or are working on integrating Hamming Backups:

- [AirGap Vault (planned)](https://github.com/airgap-it/airgap-vault)

## Credits

The original idea for the [2-of-3 Hamming Backups](https://cp4space.hatsya.com/2021/09/10/hamming-backups-a-2-of-3-variant-of-seedxor/) came from Adam P. Goucher. He created a [reference implementation](https://gitlab.com/apgoucher/hamming-backups) in python. Most of this packages code is based on the reference implementation.

The project setup has been inspired by bitcoinjs libraries, such as [bip39](https://www.npmjs.com/package/bip39) and [bip85](https://www.npmjs.com/package/bip85).

## LICENSE

MIT
