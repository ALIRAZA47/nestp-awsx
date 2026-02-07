import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Credentials = () => (
  <div className="page">
    <header className="page-header">
      <h1>Credentials</h1>
      <p>
        AWSX supports the same credential flows as the AWS SDK. You can rely on
        the default chain, point to a profile, or inject credentials from a
        secrets manager.
      </p>
    </header>

    <section className="section">
      <div className="card-stack">
        <div className="card">
          <h3>Credential Sources</h3>
          <p>
            Pick a source explicitly so your intent is clear and environments
            behave consistently.
          </p>
          <CodeBlock>{codeSamples.credentialSources}</CodeBlock>
        </div>
        <div className="card">
          <h3>Using a Credential Manager</h3>
          <p>
            Fetch secrets on startup and pass them to AWSX. This pattern works
            well with Vault, AWS Secrets Manager, or any internal service.
          </p>
          <CodeBlock>{codeSamples.credentialManager}</CodeBlock>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="card">
        <h3>Notes</h3>
        <p>
          The <strong>default</strong> source uses the AWS SDK credential chain
          (env vars, shared config/credentials files, ECS/EC2 metadata, etc.).
          Use <strong>profile</strong> to read a named profile. Use
          <strong>static</strong> when you want to pass keys explicitly or when
          you load them from a secrets manager.
        </p>
      </div>
    </section>
  </div>
);

export default Credentials;
