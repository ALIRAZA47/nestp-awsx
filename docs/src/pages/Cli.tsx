import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Cli = () => (
  <div className="page">
    <header className="page-header">
      <h1>CLI</h1>
      <p>Interactive commands to install and scaffold configuration.</p>
    </header>

    <section className="section">
      <div className="card">
        <h3>Commands</h3>
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
