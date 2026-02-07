import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Overrides = () => (
  <div className="page">
    <header className="page-header">
      <h1>Overrides & Tokens</h1>
      <p>
        Replace any AWSX service by providing a NestJS provider with the
        corresponding token. This lets you add logging, tracing, or custom
        behavior without forking the package.
      </p>
    </header>

    <section className="section">
      <div className="card">
        <h3>Override a Service</h3>
        <p>
          Swap out the built-in service for your own implementation. The rest of
          the module stays the same.
        </p>
        <CodeBlock>{codeSamples.overrideService}</CodeBlock>
      </div>
    </section>

    <section className="section">
      <div className="card">
        <h3>Token Guidelines</h3>
        <p>
          Use <code>AwsxToken</code> enum values for clients and services. This keeps
          overrides consistent and prevents string mismatches during injection.
        </p>
      </div>
    </section>
  </div>
);

export default Overrides;
