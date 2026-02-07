import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Examples = () => (
  <div className="page">
    <header className="page-header">
      <h1>Examples</h1>
      <p>
        The repo ships with complete runnable examples so you can copy a working
        setup and iterate quickly.
      </p>
    </header>

    <section className="section">
      <div className="card-stack">
        <div className="card">
          <h3>Basic Config</h3>
          <p>
            The simplest setup uses the default credential chain and a single
            region. Great for local development and most apps.
          </p>
          <CodeBlock>{codeSamples.exampleConfig}</CodeBlock>
        </div>
        <div className="card">
          <h3>Service Usage</h3>
          <p>
            The example below shows how a single NestJS service can call AWSX.
          </p>
          <CodeBlock>{codeSamples.awsxService}</CodeBlock>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="card">
        <h3>Example File Map</h3>
        <p>
          Use this structure as a reference when wiring AWSX into your own app.
        </p>
        <CodeBlock>{codeSamples.exampleFiles}</CodeBlock>
      </div>
    </section>

    <section className="section">
      <div className="card">
        <h3>Repo Examples</h3>
        <p>
          See <code>examples/basic</code> for the default-chain setup and
          <code>examples/async-config</code> for environment-driven configuration.
        </p>
      </div>
    </section>
  </div>
);

export default Examples;
