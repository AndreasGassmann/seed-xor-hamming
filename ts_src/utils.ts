import * as bip39 from 'bip39';
import { utils } from 'seed-xor';

export const toHexString = (bytes: Uint8Array): string =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const getDeterministicEntropyFromMnemonic = async (
  mnemonic: string,
): Promise<string> => {
  const salt = 'Hamming';
  const rawSecret = bip39.mnemonicToEntropy(mnemonic);

  const str = `${salt} ${rawSecret}`;

  return utils.sha256(str);
};
