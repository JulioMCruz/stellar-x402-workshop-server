# Stellar x402 Workshop Server

A clone-friendly paid API built with Next.js App Router, TypeScript, x402 v2,
Stellar USDC, and the OpenZeppelin hosted facilitator.

## Solution architecture

This repository is the **resource server**. It publishes the paid API, defines
the price and recipient, and delegates payment verification and settlement to
the OpenZeppelin facilitator. The buyer lives in the separate workshop client
repository.

```mermaid
flowchart LR
    subgraph Buyer["Buyer application"]
        UI["Next.js UI"]
        Wallet["Freighter wallet"]
        Agent["Autonomous Node.js agent"]
    end

    subgraph Server["This repository · Next.js resource server"]
        Route["App Router API route"]
        Middleware["x402 v2 middleware"]
        Resource["Premium JSON resource"]
        Config["Server-only configuration"]
    end

    subgraph Payment["Payment infrastructure"]
        OZ["OpenZeppelin x402 facilitator"]
        Stellar["Stellar network"]
        Receiver["Service provider · USDC"]
    end

    UI --> Wallet
    Wallet -->|"Signed payment authorization"| Middleware
    Agent -->|"Signed payment authorization"| Middleware
    Route --> Middleware
    Config --> Middleware
    Middleware -->|"verify / settle"| OZ
    OZ -->|"Submit settlement"| Stellar
    Stellar -->|"Transfer USDC"| Receiver
    Middleware -->|"Payment accepted"| Resource
    Resource -->|"Protected response"| UI
    Resource -->|"Protected response"| Agent
```

The API key used to call OpenZeppelin stays inside the resource server. The
server never receives the buyer's private key; it receives only a scoped,
signed authorization.

## Server request process

```mermaid
sequenceDiagram
    autonumber
    participant Client as x402 client
    participant Route as Next.js API route
    participant Middleware as x402 middleware
    participant OZ as OpenZeppelin facilitator
    participant Stellar as Stellar Testnet or Mainnet

    Client->>Route: GET /api/premium-insight
    Route->>Middleware: Evaluate payment requirement
    Middleware-->>Client: 402 + PAYMENT-REQUIRED
    Note over Client: Client signs a scoped USDC authorization
    Client->>Route: Retry + PAYMENT-SIGNATURE
    Route->>Middleware: Validate payment payload
    Middleware->>OZ: POST /verify
    OZ-->>Middleware: Payment authorization is valid
    Middleware->>OZ: POST /settle
    OZ->>Stellar: Submit authorized USDC transfer
    Stellar-->>OZ: Transaction confirmed
    OZ-->>Middleware: Settlement result
    Middleware->>Route: Allow protected handler
    Route-->>Client: 200 + JSON + PAYMENT-RESPONSE
```

### Server responsibilities

```mermaid
flowchart TD
    Start["Incoming API request"] --> Signature{"PAYMENT-SIGNATURE present?"}
    Signature -->|"No"| Quote["Build x402 v2 payment requirements"]
    Quote --> Required["Return HTTP 402 and PAYMENT-REQUIRED"]
    Signature -->|"Yes"| Verify["Ask OpenZeppelin to verify"]
    Verify --> Valid{"Authorization valid?"}
    Valid -->|"No"| Reject["Reject request without delivering the resource"]
    Valid -->|"Yes"| Settle["Ask OpenZeppelin to settle on Stellar"]
    Settle --> Settled{"Settlement confirmed?"}
    Settled -->|"No"| Failure["Return payment failure"]
    Settled -->|"Yes"| Deliver["Run protected handler"]
    Deliver --> Success["Return 200, resource and PAYMENT-RESPONSE"]
```

## What students build

`GET /api/premium-insight` costs **$0.001 USDC**. Without payment it returns
`402 Payment Required`; an x402 client signs a scoped Stellar authorization and
retries; OpenZeppelin verifies and settles it; the server returns the JSON.

## Requirements

- Node.js 22+
- A public Stellar address that can receive USDC
- OpenZeppelin facilitator API key

## Testnet setup

1. Generate an API key at https://channels.openzeppelin.com/testnet/gen
2. Copy `.env.example` to `.env.local`.
3. Set `PAY_TO` and `OPENZEPPELIN_API_KEY`.
4. Run:

```bash
npm ci
npm run dev
```

The server starts at http://localhost:3000. The separate client defaults to
http://localhost:3001.

## Test the paywall

```bash
curl -i http://localhost:3000/api/premium-insight
```

Expected: status `402` and a `PAYMENT-REQUIRED` response header.

## Mainnet configuration

The code supports Mainnet, but the workshop intentionally executes payments on
Testnet. For Mainnet, generate a key at https://channels.openzeppelin.com/gen
and switch these values together:

```dotenv
STELLAR_NETWORK=stellar:pubnet
FACILITATOR_URL=https://channels.openzeppelin.com/x402
USDC_CONTRACT=CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75
PAY_TO=G_YOUR_MAINNET_RECEIVER
OPENZEPPELIN_API_KEY=your_mainnet_key
```

Never reuse Testnet keys or addresses blindly on Mainnet. Never expose the API
key through a `NEXT_PUBLIC_` variable.

## Vercel

Import this repository in Vercel and configure the same server-side variables.
Set `CLIENT_ORIGIN` to the deployed client URL. No custom server is required.

## Validation

```bash
npm run check
```

## Official references

- https://developers.stellar.org/docs/build/agentic-payments/x402
- https://developers.stellar.org/docs/build/agentic-payments/x402/built-on-stellar
- https://docs.openzeppelin.com/relayer/guides/stellar-x402-facilitator-guide
- https://docs.x402.org/core-concepts/http-402
