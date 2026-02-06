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
