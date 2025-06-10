import { Channel } from 'amqplib';
import { RpcMessage } from './types';
import { wallet } from './lib/wallet';

// const signPsbt = async(unsignedPSBT: string): Promise<string> =>{

// }
const mnemonic = process.env.MNEMONIC;
export const methodHandlers: Record<string, (msg: RpcMessage, channel: Channel) => void> = {
  sign: async (msg, ch) => {
    console.log('Server signed PSBT:', msg.payload);
    const unsignedPSBT = msg.payload as string;
    // const signed = await signPsbt(msg.payload);
    const signed = await wallet.signPsbt(unsignedPSBT,mnemonic);
    console.log('Client signed PSBT:', signed);
    sendToServer(msg.next??'unknown', signed, ch, msg.txId);
  },
};

export function sendToServer(method: string, payload: string, channel: Channel, txId: string) {
  const msg: RpcMessage = { txId, method, payload };
  channel.sendToQueue('rpc.to-server', Buffer.from(JSON.stringify(msg)), { persistent: true });
}
