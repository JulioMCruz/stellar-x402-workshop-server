import { publicConfig } from "@/lib/config";

export default function Home() {
  const config = publicConfig();
  return (
    <main style={{ maxWidth: 760, margin: "80px auto", fontFamily: "system-ui", padding: 24 }}>
      <p>Stellar · OpenZeppelin · x402 v2</p>
      <h1>Workshop API Server</h1>
      <p>Este servidor vende una respuesta JSON por llamada mediante USDC en Stellar.</p>
      <pre style={{ background: "#111", color: "#d8ff7d", padding: 20, overflow: "auto" }}>
        {JSON.stringify(config, null, 2)}
      </pre>
      <p>Prueba sin pago: <code>GET {config.route}</code> → <strong>402 Payment Required</strong></p>
    </main>
  );
}
