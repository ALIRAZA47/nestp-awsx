import { DocHeader } from "@/components/doc-header";
import { ExampleReference } from "@/components/example-reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExamplesPage() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Tooling"
        title="Examples"
        description="Examples are split into runnable NestJS apps and focused use-case snippets. Every documentation page references these source files directly."
      />

      <Card>
        <CardHeader>
          <CardTitle>Example folders</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <ul>
            <li>`examples/basic`: static `AwsxModule.forRoot` setup with service consumption.</li>
            <li>`examples/async-config`: `forRootAsync` setup using `ConfigService` and runtime env values.</li>
            <li>`examples/use-cases`: focused snippets for each method/use-case exposed by the package.</li>
          </ul>
        </CardContent>
      </Card>

      <ExampleReference id="app.basic.module" description="Runnable static module configuration." />
      <ExampleReference id="app.basic.service" description="Runnable service-level usage from the basic app." />
      <ExampleReference id="app.async.module" description="Runnable async configuration module." />
    </div>
  );
}
