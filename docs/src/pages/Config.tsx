import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Config = () => (
  <div className="page">
    <header className="page-header">
      <h1>Config Files</h1>
      <p>Define global defaults and override per-service settings.</p>
    </header>

    <section className="section">
      <div className="two-col">
        <div className="card">
          <h3>JSON Config</h3>
          <CodeBlock>{codeSamples.configJson}</CodeBlock>
        </div>
        <div className="card">
          <h3>Typed Config (TS)</h3>
          <CodeBlock>{codeSamples.configTs}</CodeBlock>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="card">
        <h3>Defaults & Overrides</h3>
        <p>
          <strong>defaults.region</strong> sets a baseline for every service. Each
          service can override with its own <strong>region</strong> or
          <strong>credentials</strong> block. If you omit credentials, the default
          AWS credential chain is used automatically.
        </p>
      </div>
    </section>
  </div>
);

export default Config;
