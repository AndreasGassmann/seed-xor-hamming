import { combine, split } from '../ts_src/index.js';
import { combine as xor } from 'seed-xor';

const original =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';

(async () => {
  console.log('Original:', original);

  const [share1, share2, share3] = await split(original, false);

  console.log('Share 1:', share1);
  console.log('Share 2:', share2);
  console.log('Share 3:', share3);

  const try1 = share1;
  const try2 = share2;

  const recovered = await combine(try1, try2); // Any 2 shares can be used

  // The result will be an array of 2 mnemonics. One of them is the original seed.
  // console.log('Recovered:', recovered);

  const try3 = recovered[0];
  const try4 = recovered[1];

  console.log('recovered[0]', recovered[0]);
  console.log('recovered[1]', recovered[1]);

  console.log('XOR 1', (await xor([try1, try2, try3])) === try4);
  console.log('XOR 2', (await xor([try1, try2, try4])) === try3);
})();
