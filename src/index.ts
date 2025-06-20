import { getSecureChannel } from './channel';
import { RpcMessage } from './types';
import { methodHandlers } from './methodHandlers';
import { wallet } from './lib/wallet';

async function start() {

  const ch = await getSecureChannel();
  ch.prefetch(1);

  console.log('Client waiting for RPC messages...');
  ch.consume('rpc.to-client', async (msg) => {
    if (!msg) return;

    const job: RpcMessage = JSON.parse(msg.content.toString());
    console.log('Client received:', job);

    try {
      const handler = methodHandlers[job.method];
      if (handler) await handler(job, ch);
      else console.warn('No handler for method:', job.method);
      ch.ack(msg);
    } catch (err: any) {
      console.error('Client error:', err.message);
      ch.nack(msg, false, false);
    }
  });
}

// start().catch(console.error);