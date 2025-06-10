import { Channel } from 'amqplib';
import { RpcMessage } from './types';

const signPsbt = async(unsignedPSBT: string): Promise<string> =>{
  return await new Promise((resolve) => {
    setTimeout(() => {
        // Invoke rgb-signer here
      resolve(`${unsignedPSBT}-signed`);
    }, 1000);
  })
}

export const methodHandlers: Record<string, (msg: RpcMessage, channel: Channel) => void> = {
  sign: async (msg, ch) => {
    const signed = await signPsbt(msg.payload);
    sendToServer(msg.next??'unknown', signed, ch, msg.txId);
  },
};

export function sendToServer(method: string, payload: string, channel: Channel, txId: string) {
  const msg: RpcMessage = { txId, method, payload };
  channel.sendToQueue('rpc.to-server', Buffer.from(JSON.stringify(msg)), { persistent: true });
}
