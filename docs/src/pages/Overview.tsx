import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Overview = () => (
  <div className="page">
    <header className="page-hero">
      <div>
        <p className="eyebrow">NestJS + AWS SDK v3</p>
        <h1>All AWS essentials, one NestJS module.</h1>
        <p className="lead">
          AWSX wires S3, SQS, SES, and Route53 into a single module with unified
          configuration, credential handling, and clean service APIs. One client
          per service keeps things predictable and light.
        </p>
      </div>
      <div className="hero-card">
        <div className="card-header">
          <span>Quick Start</span>
          <span className="chip">awsx</span>
        </div>
        <CodeBlock>{codeSamples.quickStart}</CodeBlock>
      </div>
    </header>

    <section className="section">
      <div className="section-title">
        <h2>What You Get</h2>
        <p>Opinionated defaults with enough flexibility to grow.</p>
      </div>
      <div className="card-grid">
        <article className="card">
          <h3>Single Client per Service</h3>
          <p>
            One client instance per AWS service keeps runtime predictable and avoids
            credential confusion.
          </p>
        </article>
        <article className="card">
          <h3>Unified Config</h3>
          <p>
            Centralize defaults and override per service without scattering AWS
            setup across your codebase.
          </p>
        </article>
        <article className="card">
          <h3>Typed Tokens</h3>
          <p>
            Use enums for tokens and service keys, eliminating magic strings.
          </p>
        </article>
        <article className="card">
          <h3>Easy Extension</h3>
          <p>
            Override any service with NestJS providers when you need custom
            behavior.
          </p>
        </article>
      </div>
    </section>
  </div>
);

export default Overview;
