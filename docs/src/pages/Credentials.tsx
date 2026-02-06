import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Credentials = () => (
  <div className="page">
    <header className="page-header">
      <h1>Credentials</h1>
      <p>Choose the credential strategy that fits your environment.</p>
    </header>

    <section className="section">
      <div className="two-col">
        <div className="card">
          <h3>Credential Sources</h3>
          <CodeBlock>{codeSamples.credentialSources}</CodeBlock>
        </div>
        <div className="card">
          <h3>Using a Credential Manager</h3>
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
          <strong>static</strong> when you want to pass keys explicitly.
        </p>
      </div>
    </section>
  </div>
);

export default Credentials;
