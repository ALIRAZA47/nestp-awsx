import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Config = () => (
  <div className="page">
    <header className="page-header">
      <h1>Config Files</h1>
      <p>
        AWSX config is intentionally small. You define defaults once, then override
        per-service where needed. If you omit credentials, the AWS SDK default
        chain is used.
      </p>
    </header>

    <section className="section">
      <div className="card-stack">
        <div className="card">
          <h3>JSON Config</h3>
          <p>
            Use JSON when you want a simple config file that is easy to share
            across teams or environments.
          </p>
          <CodeBlock>{codeSamples.configJson}</CodeBlock>
        </div>
        <div className="card">
          <h3>Typed Config (TS)</h3>
          <p>
            Use TypeScript when you want enum safety and programmatic composition.
          </p>
          <CodeBlock>{codeSamples.configTs}</CodeBlock>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="card-stack">
        <div className="card">
          <h3>Client Logger</h3>
          <p>
            Enable logging globally for SDK clients that support a logger. You can
            pass your own logger or use the built-in <code>AwsxConsoleLogger</code>.
          </p>
          <CodeBlock>{codeSamples.loggerConfig}</CodeBlock>
        </div>
        <div className="card">
          <h3>Defaults & Overrides</h3>
          <p>
            <strong>defaults.region</strong> sets a baseline for every service.
            Each service can override <strong>region</strong> or
            <strong>credentials</strong>. This keeps configuration concise while
            still allowing precise control for edge cases.
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default Config;
