import CodeBlock from "../components/CodeBlock";
import { codeSamples } from "../content";

const Services = () => (
  <div className="page">
    <header className="page-header">
      <h1>Services</h1>
      <p>
        Use the aggregated AwsxService for quick access, or inject a specific
        service/client when you want tighter dependencies.
      </p>
    </header>

    <section className="section">
      <div className="card">
        <h3>Aggregated Service</h3>
        <CodeBlock>{codeSamples.awsxService}</CodeBlock>
      </div>
    </section>

    <section className="section">
      <div className="card-grid">
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
          Common helper methods built on top of AWS SDK calls. They are thin
          wrappers, so you can still fall back to raw client methods when you
          need full control.
        </p>
      </div>
      <div className="card-grid">
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
      <div className="two-col">
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
        <CodeBlock>{codeSamples.sqsBatch}</CodeBlock>
      </div>
    </section>

    <section className="section">
      <div className="two-col">
        <div className="card">
          <h3>Inject a Raw Client</h3>
          <CodeBlock>{codeSamples.injectClient}</CodeBlock>
        </div>
        <div className="card">
          <h3>Inject a Service</h3>
          <CodeBlock>{codeSamples.injectService}</CodeBlock>
        </div>
      </div>
    </section>
  </div>
);

export default Services;
