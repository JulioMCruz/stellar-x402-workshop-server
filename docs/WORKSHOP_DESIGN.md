# Workshop design

The server is a deliberately small Next.js App Router resource server. A free
`/api/info` route lets students inspect its configuration; a paid
`/api/premium-insight` route demonstrates x402 v2 with the `exact` Stellar
scheme and USDC. OpenZeppelin's hosted facilitator verifies and settles the
payment. Secrets remain server-side.

Testnet is the safe workshop default. Mainnet is supported without code changes
by switching `STELLAR_NETWORK`, `FACILITATOR_URL`, `USDC_CONTRACT`, `PAY_TO`, and
the OpenZeppelin API key together.

Success means: an unpaid request returns 402 and `PAYMENT-REQUIRED`; a compliant
client signs the scoped Soroban authorization; the retry returns 200 and
`PAYMENT-RESPONSE`; tests and production build pass.
