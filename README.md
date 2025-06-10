
# ThunderLink RGB Signer

**ThunderLink RGB Signer** is a lightweight backend service designed to securely sign PSBTs (Partially Signed Bitcoin Transactions) on behalf of the ThunderLink RGB Manager. It is meant to be run in a customer-controlled environment and never exposes any external HTTP interfaces. All communication is handled over **RabbitMQ channels**, ensuring a secure and isolated signing process.

---

## 🔐 Purpose

- Holds or accesses the merchant’s private keys (via mnemonic or other secure key source)
- Listens for signing requests from ThunderLink RGB Manager
- Signs PSBTs and returns signed transactions through a secure message queue
- **Never exposes keys or services over the public internet**

---

## 📦 Deployment

### Requirements
- RabbitMQ connection - provided by ThunderLink

### Setup
1. Clone the ThunderLink RGB Signer service.
2. Create a `.env` file with:
\`\`\`env
MNEMONIC="" 
XPUB_VAN="" 
XPUB_COL="" 
RABBITMQ_URI="" // provided by ThunderLink
\`\`\`
3. Start the signer:
\`\`\`bash
npm install
npm run build
npm run start
\`\`\`

---

## 🛠️ How It Works

1. The service establishes a secure RabbitMQ connection and listens to the queue `rpc.to-client`.
2. When a `sign` request is received, it:
   - Parses the PSBT from the message payload
   - Init RGB wallet use mnemonic, xpub-van, xpub-col
   - Signs the PSBT
   - Sends the signed result to `rpc.to-server` with the same transaction ID (`txId`)

---

## 📡 Communication Model

| Direction       | Queue           | Purpose                               |
|----------------|------------------|---------------------------------------|
| RGB Manager → Signer | `rpc.to-client`   | Sends PSBTs for signing                |
| Signer → RGB Manager | `rpc.to-server`   | Returns signed PSBTs                   |

Each message follows this structure:
\`\`\`ts
interface RpcMessage {
  txId: string;          // Unique transaction ID for tracking
  method: string;        // e.g. "sign"
  payload: string;       // PSBT (string) or response data
  next?: string;         // Optional: next method to call on response
}
\`\`\`

---

## 🧩 Method Handlers

Currently supported:

| Method | Description                  |
|--------|------------------------------|
| `sign` | Signs a base64-encoded PSBT using the mnemonic-derived key and returns the signed PSBT |

> New methods can be added by extending the `methodHandlers` map.

---

## 📘 Example Flow

1. RGB Manager sends:
\`\`\`json
{
  "txId": "123abc",
  "method": "sign",
  "payload": "<unsigned_psbt_base64>",
  "next": "broadcast"
}
\`\`\`

2. RGB Signer signs and responds:
\`\`\`json
{
  "txId": "123abc",
  "method": "broadcast",
  "payload": "<signed_psbt_base64>"
}
\`\`\`

---

## 🔒 Security Notes

- **No public-facing ports**: All communication is internal via RabbitMQ.
- **Private keys are never transmitted**: Only unsigned PSBTs and signed responses are exchanged.
- **Signer is isolated**: Runs inside your infrastructure, fully under your control.
