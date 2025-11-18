import { createWalletManager } from 'rgb-sdk';

const xpub_van = process.env.XPUB_VAN!;
const xpub_col = process.env.XPUB_COL!;
const mnemonic = process.env.MNEMONIC;
const master_fingerprint=  process.env.MASTER_FINGERPRINT!
const network = process.env.BITCOIN_NETWORK!;
console.log("BITCOIN_NETWORK raw",network)
if (!network) throw new Error("BITCOIN_NETWORK is not set");

if(!master_fingerprint){
  throw new Error('MASTER_FINGERPRINT is missing from environment variables');
}
if (!xpub_van) {
  throw new Error('XPUB_VAN is missing from environment variables');
}
if (!xpub_col) {
  throw new Error('XPUB_COL is missing from environment variables');
}

const wallet = createWalletManager({rgb_node_endpoint: 'https://rgb-node.test.thunderstack.org',xpub_van,xpub_col,mnemonic,master_fingerprint,network:network.toLowerCase()});

console.log('Wallet initialized with xpub_van:', xpub_van, 'and xpub_col:', xpub_col,'master_fingerprint',master_fingerprint,'network',network);

export { wallet };