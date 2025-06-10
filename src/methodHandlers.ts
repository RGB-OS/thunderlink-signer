import { Channel } from 'amqplib';
import { RpcMessage } from './types';
import { wallet } from './lib/wallet';

const mnemonic = process.env.MNEMONIC;
export const methodHandlers: Record<string, (msg: RpcMessage, channel: Channel) => void> = {
  sign: async (msg, ch) => {
    const unsignedPSBT = msg.payload as string;
    const signed = await wallet.signPsbt(unsignedPSBT,mnemonic);
    sendToServer(msg.next??'unknown', signed, ch, msg.txId);
  },
};

export function sendToServer(method: string, payload: string, channel: Channel, txId: string) {
  const msg: RpcMessage = { txId, method, payload };
  channel.sendToQueue('rpc.to-server', Buffer.from(JSON.stringify(msg)), { persistent: true });
}
