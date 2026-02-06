import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Examples = () => (
  <div className="page">
    <header className="page-header">
      <h1>Examples</h1>
      <p>
        Reference configuration and usage patterns taken directly from the repo.
      </p>
    </header>

    <section className="section">
      <div className="two-col">
        <div className="card">
          <h3>Basic Config</h3>
          <CodeBlock>{codeSamples.exampleConfig}</CodeBlock>
        </div>
        <div className="card">
          <h3>Service Usage</h3>
          <CodeBlock>{codeSamples.awsxService}</CodeBlock>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="card">
        <h3>Example File Map</h3>
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
