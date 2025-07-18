import { wallet } from 'rgb-connect-nodejs';

const xpub_van = process.env.XPUB_VAN!;
const xpub_col = process.env.XPUB_COL!;
const mnemonic = process.env.MNEMONIC;
const master_fingerprint=  process.env.MASTER_FINGERPRINT!
const raw = process.env.BITCOIN_NETWORK;
console.log("BITCOIN_NETWORK raw",raw)
if (!raw) throw new Error("BITCOIN_NETWORK is not set");

const network = parseInt(raw, 10);
console.log("BITCOIN_NETWORK network",network)
if (isNaN(network)) throw new Error(`Invalid BITCOIN_NETWORK: ${raw}`);



if(!master_fingerprint){
  throw new Error('MASTER_FINGERPRINT is missing from environment variables');
}
if (!xpub_van) {
  throw new Error('XPUB_VAN is missing from environment variables');
}
if (!xpub_col) {
  throw new Error('XPUB_COL is missing from environment variables');
}

wallet.init({xpub_van,xpub_col,mnemonic,master_fingerprint,network});
console.log('Wallet initialized with xpub_van:', xpub_van, 'and xpub_col:', xpub_col,'master_fingerprint',master_fingerprint,'network',network);

export { wallet };