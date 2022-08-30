import * as bip39 from 'bip39';
import { utils } from 'seed-xor';
import { hammingBackup } from './hamming-backup';
import { getDeterministicEntropyFromMnemonic } from './utils';

// https://cp4space.hatsya.com/2021/09/10/hamming-backups-a-2-of-3-variant-of-seedxor/

export const split = async (
  mnemonic: string,
  useRandom = false,
): Promise<[string, string, string]> => {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('[Hamming]: Invalid mnemonic');
  }
  if (mnemonic.split(' ').length !== 24) {
    throw new Error('[Hamming]: Invalid mnemonic length');
  }

  const share1Entropy = useRandom
    ? await utils.getRandomEntropy()
    : await getDeterministicEntropyFromMnemonic(mnemonic);

  const share1 = bip39.entropyToMnemonic(share1Entropy);
  const [share2, share3] = hammingBackup(mnemonic, share1);

  return [share1, share2, share3];
};

export const combine = async (
  share1: string,
  share2: string,
): Promise<[string, string]> => {
  if (!bip39.validateMnemonic(share1) || !bip39.validateMnemonic(share2)) {
    throw new Error('[Hamming]: Invalid mnemonic');
  }
  if (share1.split(' ').length !== 24 || share2.split(' ').length !== 24) {
    throw new Error('[Hamming]: Invalid mnemonic length');
  }

  return hammingBackup(share1, share2);
};
