"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeterministicEntropyFromMnemonic = exports.toHexString = void 0;
const bip39 = require("bip39");
const seed_xor_1 = require("seed-xor");
const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
exports.toHexString = toHexString;
const getDeterministicEntropyFromMnemonic = async (mnemonic) => {
    const salt = 'Hamming';
    const rawSecret = bip39.mnemonicToEntropy(mnemonic);
    const str = `${salt} ${rawSecret}`;
    return seed_xor_1.utils.sha256(str);
};
exports.getDeterministicEntropyFromMnemonic = getDeterministicEntropyFromMnemonic;
