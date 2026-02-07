import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Overview = () => (
  <div className="page">
    <header className="page-hero">
      <div>
        <p className="eyebrow">NestJS + AWS SDK v3</p>
        <h1>All AWS essentials, one NestJS module.</h1>
        <p className="lead">
          AWSX gives you a single, consistent way to wire S3, SQS, SES, and Route53
          into NestJS. The goal is simple: fewer moving parts, clearer configuration,
          and predictable clients that are easy to extend and test.
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
        <h2>What AWSX Solves</h2>
        <p>
          You still use the official AWS SDK clients, but AWSX removes the repetitive
          wiring and exposes clean, focused services for the most common tasks.
        </p>
      </div>
      <div className="card-stack">
        <article className="card">
          <h3>One Client per Service</h3>
          <p>
            Each service gets exactly one client instance. No more guessing which
            credentials were used to build which client.
          </p>
        </article>
        <article className="card">
          <h3>Unified Configuration</h3>
          <p>
            Set global defaults once, override per service only where needed, and
            keep configuration close to your module boundaries.
          </p>
        </article>
        <article className="card">
          <h3>Typed Tokens & Keys</h3>
          <p>
            Enums for tokens and service keys remove magic strings and prevent
            subtle injection mistakes.
          </p>
        </article>
        <article className="card">
          <h3>Extensible by Design</h3>
          <p>
            Swap any service with your own implementation by providing a NestJS
            provider. No forks required.
          </p>
        </article>
      </div>
    </section>

    <section className="section">
      <div className="card">
        <h3>Repository</h3>
        <p>
          Source, issues, and releases live in the GitHub repo:
          <a
            className="inline-link"
            href="https://github.com/ALIRAZA47/nestp-awsx"
            target="_blank"
            rel="noreferrer"
          >
            github.com/ALIRAZA47/nestp-awsx
          </a>
        </p>
      </div>
    </section>
  </div>
);

export default Overview;
