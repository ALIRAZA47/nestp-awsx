import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Quickstart = () => (
  <div className="page">
    <header className="page-header">
      <h1>Quick Start</h1>
      <p>
        Use <code>forRoot</code> for static config or <code>forRootAsync</code> when
        you need environment-driven values. Both options return the same AWSX
        services and clients.
      </p>
    </header>

    <section className="section">
      <div className="card-stack">
        <div className="card">
          <h3>Module Setup</h3>
          <p>
            Start with a default region and the AWS SDK default credential chain.
            This is the safest setup for local dev and most deployments.
          </p>
          <CodeBlock>{codeSamples.quickStart}</CodeBlock>
        </div>
        <div className="card">
          <h3>Async Configuration</h3>
          <p>
            Pull config from <code>ConfigService</code> or your own secrets manager
            without hardcoding values in the module.
          </p>
          <CodeBlock>{codeSamples.asyncConfig}</CodeBlock>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="card">
        <h3>Use the Aggregated Service</h3>
        <p>
          The <code>AwsxService</code> exposes all supported AWS services from a
          single injection point.
        </p>
        <CodeBlock>{codeSamples.awsxService}</CodeBlock>
      </div>
    </section>
  </div>
);

export default Quickstart;
