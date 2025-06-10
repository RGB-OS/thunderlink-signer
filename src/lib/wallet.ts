import { wallet } from 'rgb-connect-nodejs';

const xpub_van = process.env.XPUB_VAN!;
const xpub_col = process.env.XPUB_COL!;

if (!xpub_van) {
  throw new Error('XPUB_VAN is missing from environment variables');
}
if (!xpub_col) {
  throw new Error('XPUB_COL is missing from environment variables');
}

wallet.init(xpub_van,xpub_col);
console.log('Wallet initialized with xpub_van:', xpub_van, 'and xpub_col:', xpub_col);

export { wallet };