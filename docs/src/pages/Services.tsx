import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Services = () => (
  <div className="page">
    <header className="page-header">
      <h1>Services</h1>
      <p>
        AWSX exposes service wrappers that mirror the AWS SDK, plus convenience
        helpers for common patterns. You can use the aggregated
        <code>AwsxService</code> or inject a specific service directly.
      </p>
    </header>

    <section className="section">
      <div className="card">
        <h3>Aggregated Service</h3>
        <p>
          Use this when you want a single dependency and you already know which
          AWS services you will call.
        </p>
        <CodeBlock>{codeSamples.awsxService}</CodeBlock>
      </div>
    </section>

    <section className="section">
      <div className="section-title">
        <h2>Core Operations</h2>
        <p>These methods are direct wrappers around the AWS SDK commands.</p>
      </div>
      <div className="card-stack">
        <div className="card">
          <h3>S3</h3>
          <CodeBlock>{codeSamples.s3}</CodeBlock>
        </div>
        <div className="card">
          <h3>SQS</h3>
          <CodeBlock>{codeSamples.sqs}</CodeBlock>
        </div>
        <div className="card">
          <h3>SES</h3>
          <CodeBlock>{codeSamples.ses}</CodeBlock>
        </div>
        <div className="card">
          <h3>Route53</h3>
          <CodeBlock>{codeSamples.route53}</CodeBlock>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-title">
        <h2>Helpers</h2>
        <p>
          Convenience methods built on top of SDK commands. They are thin wrappers,
          so you can always drop down to raw commands for special cases.
        </p>
      </div>
      <div className="card-stack">
        <div className="card">
          <h3>S3 Helpers</h3>
          <CodeBlock>{codeSamples.s3Helpers}</CodeBlock>
        </div>
        <div className="card">
          <h3>SQS Helpers</h3>
          <CodeBlock>{codeSamples.sqsHelpers}</CodeBlock>
        </div>
        <div className="card">
          <h3>SES Helpers</h3>
          <CodeBlock>{codeSamples.sesHelpers}</CodeBlock>
        </div>
        <div className="card">
          <h3>Route53 Helpers</h3>
          <CodeBlock>{codeSamples.route53Helpers}</CodeBlock>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-title">
        <h2>S3 Power Moves</h2>
        <p>Signed URLs and bulk uploads for everyday workflows.</p>
      </div>
      <div className="card-stack">
        <div className="card">
          <h3>Signed URLs</h3>
          <CodeBlock>{codeSamples.s3SignedUrl}</CodeBlock>
        </div>
        <div className="card">
          <h3>Upload Many</h3>
          <CodeBlock>{codeSamples.s3PutMany}</CodeBlock>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="card">
        <h3>SQS Batch Sends</h3>
        <p>
          Batch sends are ideal for high-throughput workloads and reduce API calls.
        </p>
        <CodeBlock>{codeSamples.sqsBatch}</CodeBlock>
      </div>
    </section>

    <section className="section">
      <div className="card-stack">
        <div className="card">
          <h3>Inject a Raw Client</h3>
          <p>
            Use this when you want full access to the AWS SDK client surface area.
          </p>
          <CodeBlock>{codeSamples.injectClient}</CodeBlock>
        </div>
        <div className="card">
          <h3>Inject a Service</h3>
          <p>
            Prefer service injection when you want the AWSX helper methods but
            still keep your dependencies tight.
          </p>
          <CodeBlock>{codeSamples.injectService}</CodeBlock>
        </div>
      </div>
    </section>
  </div>
);

export default Services;
