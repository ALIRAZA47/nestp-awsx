import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Quickstart = () => (
  <div className="page">
    <header className="page-header">
      <h1>Quick Start</h1>
      <p>
        Start with `forRoot` for static config or `forRootAsync` when you need
        environment-aware values.
      </p>
    </header>

    <section className="section">
      <div className="two-col">
        <div className="card">
          <h3>Module Setup</h3>
          <CodeBlock>{codeSamples.quickStart}</CodeBlock>
        </div>
        <div className="card">
          <h3>Async Configuration</h3>
          <CodeBlock>{codeSamples.asyncConfig}</CodeBlock>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="card">
        <h3>Use the Aggregated Service</h3>
        <CodeBlock>{codeSamples.awsxService}</CodeBlock>
      </div>
    </section>
  </div>
);

export default Quickstart;
