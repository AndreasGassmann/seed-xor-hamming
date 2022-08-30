"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hammingBackup = exports.xor_lists = void 0;
const bip39 = require("bip39");
const utils_1 = require("./utils");
// Original implementation: https://gitlab.com/apgoucher/hamming-backups/-/blob/master/implementation.py
const _left_rotate_4 = (half2) => {
    const n = half2.length;
    const result = [];
    for (let i = 0; i < half2.length; i++) {
        result.push(((half2[i] << 4) | (half2[(i + 1) % n] >> 4)) & 255);
    }
    return result;
};
const _right_rotate_4 = (half2) => {
    const n = half2.length;
    const result = [];
    for (let i = 0; i < half2.length; i++) {
        result.push(((half2[i] >> 4) | (half2[(i + n - 1) % n] << 4)) & 255);
    }
    return result;
};
const split_mnemonic = (words) => {
    /*
      Splits a 256-bit seed (represented as a BIP39 mnemonic) into two
      128-bit halves (each represented as a list of 16 uint8s).
    */
    // extract the entropy and check it:
    const stringEntropy = bip39.mnemonicToEntropy(words, bip39.wordlists[0]);
    // hex string to int array:
    const entropy = [];
    for (let i = 0; i < stringEntropy.length; i += 2) {
        entropy.push(parseInt(stringEntropy.substr(i, 2), 16));
    }
    const half = Math.ceil(entropy.length / 2);
    // split into two halves:
    const half1 = entropy.slice(0, half);
    const half2 = entropy.slice(-half);
    // left-rotate second half by 4 bits (to match pen-and-paper approach):
    const rotatedHalf2 = _left_rotate_4(half2);
    return [half1, rotatedHalf2];
};
const combine_halves = (half1, half2) => {
    /*
      Combines two 128-bit halves (each represented as a list of 16 uint8s)
      into a 256-bit seed (represented as a BIP39 mnemonic).
    */
    // right-rotate second half by 4 bits:
    const rotatedHalf2 = _right_rotate_4(half2);
    // concatenate:
    const entropy = half1.concat(rotatedHalf2);
    // convert back to mnemonic (computing checksum):
    const stringEntropy = (0, utils_1.toHexString)(new Uint8Array(entropy));
    const words = bip39.entropyToMnemonic(stringEntropy);
    return words;
};
const xor_lists = (...lists) => {
    /*
      Applies the XOR function, elementwise, to lists of integers
      of equal length.
  
      For example:
  
      xor_lists([1, 4, 1, 5, 9, 2, 6, 5], [3, 5, 8, 9, 7, 9, 3, 2])
      returns [2, 1, 9, 12, 14, 11, 5, 7]
    */
    if (lists.some((list) => list.length !== lists[0].length)) {
        throw new Error('list lenghts are not same length');
    }
    const clones = lists.map((list) => [...list]);
    const result = clones[0];
    for (let x = 1; x < clones.length; x++) {
        for (let y = 0; y < clones[x].length; y++) {
            result[y] = result[y] ^ clones[x][y];
        }
    }
    return result;
};
exports.xor_lists = xor_lists;
const hammingBackup = (X, A) => {
    /*
      This can be used to create and recover Hamming backups.
  
      Creation: if you have a secret seed mnemonic X and another randomly
      generated seed mnemonic A, then calling hammingBackup(X, A) will
      return a pair (B, C) of new seed mnemonics. Then {A, B, C} is a
      Hamming backup for the original seed X.
  
      Recovery: if you have two parts of the backup and call this function
      on those parts, then this will return -- in some order -- the third
      part of the backup and the original seed X. More specifically:
  
      hammingBackup(A, B) returns (X, C)
      hammingBackup(B, C) returns (X, A)
      hammingBackup(C, A) returns (X, B)
      hammingBackup(B, A) returns (C, X)
      hammingBackup(C, B) returns (A, X)
      hammingBackup(A, C) returns (B, X)
      */
    const [x1, x2] = split_mnemonic(X);
    const [a1, a2] = split_mnemonic(A);
    const b1 = (0, exports.xor_lists)(a1, a2, x2);
    const b2 = (0, exports.xor_lists)(a2, b1, x1);
    const c1 = (0, exports.xor_lists)(b1, b2, x2);
    const c2 = (0, exports.xor_lists)(b2, c1, x1);
    const B = combine_halves(b1, b2);
    const C = combine_halves(c1, c2);
    return [B, C];
};
exports.hammingBackup = hammingBackup;
