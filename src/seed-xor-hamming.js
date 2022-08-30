"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combine = exports.split = void 0;
const bip39 = require("bip39");
const seed_xor_1 = require("seed-xor");
const hamming_backup_1 = require("./hamming-backup");
const utils_1 = require("./utils");
// https://cp4space.hatsya.com/2021/09/10/hamming-backups-a-2-of-3-variant-of-seedxor/
const split = async (mnemonic, useRandom = false) => {
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('[Hamming]: Invalid mnemonic');
    }
    if (mnemonic.split(' ').length !== 24) {
        throw new Error('[Hamming]: Invalid mnemonic length');
    }
    const share1Entropy = useRandom
        ? await seed_xor_1.utils.getRandomEntropy()
        : await (0, utils_1.getDeterministicEntropyFromMnemonic)(mnemonic);
    const share1 = bip39.entropyToMnemonic(share1Entropy);
    const [share2, share3] = (0, hamming_backup_1.hammingBackup)(mnemonic, share1);
    return [share1, share2, share3];
};
exports.split = split;
const combine = async (share1, share2) => {
    if (!bip39.validateMnemonic(share1) || !bip39.validateMnemonic(share2)) {
        throw new Error('[Hamming]: Invalid mnemonic');
    }
    if (share1.split(' ').length !== 24 || share2.split(' ').length !== 24) {
        throw new Error('[Hamming]: Invalid mnemonic length');
    }
    return (0, hamming_backup_1.hammingBackup)(share1, share2);
};
exports.combine = combine;
