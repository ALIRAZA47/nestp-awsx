import { DocHeader } from "@/components/doc-header";
import { ExampleReference } from "@/components/example-reference";
import { CodeBlock } from "@/components/code-block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cliCommands = `awsx install
awsx init
awsx setup
awsx validate [-c|--config <path>]`;

export function CliPage() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Tooling"
        title="CLI"
        description="The CLI provides an interactive install and config workflow for teams that want a fast and consistent setup path."
      />

      <Card>
        <CardHeader>
          <CardTitle>Available commands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeBlock code={cliCommands} language="bash" />
          <div className="docs-prose">
            <ul>
              <li>`awsx install`: installs `@nestp/awsx` using the selected package manager.</li>
              <li>`awsx init`: prompts for region, services, credentials, and writes config JSON.</li>
              <li>`awsx setup`: runs install flow and config generation in one guided path.</li>
              <li>`awsx validate`: checks that the config file exists, is valid JSON, and has the expected shape (defaults, global, services). Use `-c`/`--config` to specify a path (default: awsx.config.json).</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CLI configuration behavior</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <ul>
            <li>Can configure one global credential set for all services.</li>
            <li>Can configure service-specific credentials when accounts differ by service.</li>
            <li>Supports S3 default bucket and (when configured) SQS default queue URL so they can be omitted in method calls.</li>
          </ul>
        </CardContent>
      </Card>

      <ExampleReference id="cli.workflow" description="Complete walkthrough output from the interactive CLI flow." />
    </div>
  );
}
