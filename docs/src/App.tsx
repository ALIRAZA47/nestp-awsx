import { useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark";

const quickStart = `import { Module } from "@nestjs/common";
import { AwsxCredentialSource, AwsxModule } from "@nestp/awsx";

@Module({
  imports: [
    AwsxModule.forRoot({
      defaults: { region: "us-east-1" },
      global: { source: AwsxCredentialSource.Default }
    })
  ]
})
export class AppModule {}`;

const configExample = `{
  "defaults": { "region": "us-east-1" },
  "global": { "source": "default" },
  "services": {
    "s3": {
      "credentials": { "profile": "prod", "source": "profile" }
    },
    "ses": {
      "region": "us-west-2",
      "credentials": {
        "accessKeyId": "AKIA...",
        "secretAccessKey": "...",
        "source": "static"
      }
    }
  }
}`;

const cliExample = `npx @nestp/awsx setup
npx @nestp/awsx init
npx @nestp/awsx install`;

const injectionExample = `import { Inject } from "@nestjs/common";
import { AwsxToken } from "@nestp/awsx";
import type { S3Client } from "@aws-sdk/client-s3";

constructor(@Inject(AwsxToken.S3Client) private readonly client: S3Client) {}`;

const apiExample = `import { Injectable } from "@nestjs/common";
import { AwsxService } from "@nestp/awsx";

@Injectable()
export class UploadService {
  constructor(private readonly awsx: AwsxService) {}

  async uploadSample() {
    return this.awsx.s3.putObject({
      Bucket: "my-bucket",
      Key: "sample.json",
      Body: JSON.stringify({ ok: true })
    });
  }
}`;

const DEFAULT_THEME: ThemeMode = "light";

const readStoredTheme = (): ThemeMode => {
  const stored = window.localStorage.getItem("awsx-theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return DEFAULT_THEME;
};

const App = () => {
  const [theme, setTheme] = useState<ThemeMode>(DEFAULT_THEME);

  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("awsx-theme", theme);
  }, [theme]);

  const toggleThemeLabel = useMemo(
    () => (theme === "light" ? "Switch to dark" : "Switch to light"),
    [theme],
  );

  return (
    <div className="app">
      <header className="hero">
        <nav className="nav">
          <div className="logo">AWSX</div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#quickstart">Quick Start</a>
            <a href="#config">Config</a>
            <a href="#cli">CLI</a>
            <button
              className="theme-toggle"
              onClick={() =>
                setTheme((current) => (current === "light" ? "dark" : "light"))
              }
            >
              {toggleThemeLabel}
            </button>
          </div>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">NestJS + AWS SDK v3</p>
            <h1>One client per AWS service, one module for your stack.</h1>
            <p className="lead">
              AWSX gives NestJS apps a clean, composable way to wire S3, SQS, SES, and
              Route53 with unified config, credentials, and consistent service APIs.
            </p>
            <div className="hero-actions">
              <a className="primary" href="#quickstart">Get Started</a>
              <a className="ghost" href="#config">View API</a>
            </div>
            <div className="hero-meta">
              <span>Credential sources: default chain, profiles, static keys</span>
              <span>Type-safe tokens & service keys</span>
            </div>
          </div>
          <div className="hero-card">
            <div className="card-header">
              <span>Quick Start</span>
              <span className="chip">awsx</span>
            </div>
            <pre>
              <code>{quickStart}</code>
            </pre>
          </div>
        </div>
      </header>

      <section id="features" className="section">
        <div className="section-title">
          <h2>Why AWSX</h2>
          <p>Opinionated defaults with plenty of extension points.</p>
        </div>
        <div className="card-grid">
          <article className="card">
            <h3>Single Client Per Service</h3>
            <p>
              Each AWS service gets exactly one client instance, keeping your
              dependency graph predictable and light.
            </p>
          </article>
          <article className="card">
            <h3>Credential Flexibility</h3>
            <p>
              Use the default AWS credential chain, shared config profiles, or
              static keys with an explicit source flag.
            </p>
          </article>
          <article className="card">
            <h3>Typed Tokens</h3>
            <p>
              No magic strings. Use exported enums for tokens and service keys for
              safer imports and overrides.
            </p>
          </article>
          <article className="card">
            <h3>Extend or Replace</h3>
            <p>
              Swap in your own services by providing NestJS providers keyed by
              AWSX tokens.
            </p>
          </article>
        </div>
      </section>

      <section id="quickstart" className="section">
        <div className="section-title">
          <h2>Quick Start</h2>
          <p>Wire AWSX into your NestJS module in minutes.</p>
        </div>
        <div className="two-col">
          <div className="card">
            <h3>Module Setup</h3>
            <pre>
              <code>{quickStart}</code>
            </pre>
          </div>
          <div className="card">
            <h3>Service Usage</h3>
            <pre>
              <code>{apiExample}</code>
            </pre>
          </div>
        </div>
      </section>

      <section id="config" className="section">
        <div className="section-title">
          <h2>Config Options</h2>
          <p>Global defaults plus per-service overrides.</p>
        </div>
        <div className="two-col">
          <div className="card">
            <h3>awsx.config.json</h3>
            <pre>
              <code>{configExample}</code>
            </pre>
          </div>
          <div className="card">
            <h3>Inject a Client</h3>
            <pre>
              <code>{injectionExample}</code>
            </pre>
          </div>
        </div>
      </section>

      <section id="cli" className="section">
        <div className="section-title">
          <h2>CLI</h2>
          <p>Interactive setup with sensible defaults.</p>
        </div>
        <div className="card">
          <pre>
            <code>{cliExample}</code>
          </pre>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Extend AWSX</h2>
          <p>Override services cleanly using NestJS providers.</p>
        </div>
        <div className="card">
          <pre>
            <code>{`import { Module } from "@nestjs/common";
import { AwsxModule, AwsxToken } from "@nestp/awsx";
import { CustomS3Service } from "./custom-s3.service";

@Module({
  imports: [AwsxModule.forRoot({ defaults: { region: "us-east-1" } })],
  providers: [{ provide: AwsxToken.S3Service, useClass: CustomS3Service }]
})
export class AppModule {}`}</code>
          </pre>
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>@nestp/awsx</strong>
          <span>One-stop AWS integration for NestJS.</span>
        </div>
        <div className="footer-links">
          <a href="#quickstart">Quick Start</a>
          <a href="#config">Config</a>
          <a href="#cli">CLI</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
