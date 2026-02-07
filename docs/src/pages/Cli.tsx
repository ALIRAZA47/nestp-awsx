import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Cli = () => (
  <div className="page">
    <header className="page-header">
      <h1>CLI</h1>
      <p>
        Use the CLI to install AWSX and generate configuration files without
        leaving your terminal.
      </p>
    </header>

    <section className="section">
      <div className="card">
        <h3>Commands</h3>
        <p>
          Run <code>setup</code> for a full guided flow, or use the individual
          commands when you want more control.
        </p>
        <CodeBlock>{codeSamples.cli}</CodeBlock>
      </div>
    </section>

    <section className="section">
      <div className="card">
        <h3>What It Does</h3>
        <p>
          <strong>setup</strong> installs the package and guides you through
          generating <code>awsx.config.json</code>. <strong>init</strong> generates
          config only. <strong>install</strong> installs the package with your
          preferred package manager.
        </p>
      </div>
    </section>
  </div>
);

export default Cli;
