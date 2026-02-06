import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Overrides = () => (
  <div className="page">
    <header className="page-header">
      <h1>Overrides & Tokens</h1>
      <p>
        Customize AWSX services without forking the package by replacing providers
        with your own classes.
      </p>
    </header>

    <section className="section">
      <div className="card">
        <h3>Override a Service</h3>
        <CodeBlock>{codeSamples.overrideService}</CodeBlock>
      </div>
    </section>

    <section className="section">
      <div className="card">
        <h3>Token Guidelines</h3>
        <p>
          Use <code>AwsxToken</code> enum values for clients and services. This keeps
          overrides consistent and prevents string mismatches.
        </p>
      </div>
    </section>
  </div>
);

export default Overrides;
