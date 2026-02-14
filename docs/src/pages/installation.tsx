import { DocHeader } from "@/components/doc-header";
import { ExampleReference } from "@/components/example-reference";
import { CodeBlock } from "@/components/code-block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const installBlock = `npm install @nestp/awsx
# or
pnpm add @nestp/awsx
# or
yarn add @nestp/awsx`;

const peerBlock = `npm install @nestjs/common reflect-metadata`;

export function InstallationPage() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Getting Started"
        title="Installation"
        description="Install the package, confirm peer dependencies, and start with either static or async module configuration."
      />

      <Card>
        <CardHeader>
          <CardTitle>Install package</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeBlock code={installBlock} language="bash" />
          <p className="text-sm text-muted-foreground">Use the package manager already used by your NestJS project.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Peer dependencies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeBlock code={peerBlock} language="bash" />
          <p className="text-sm text-muted-foreground">`@nestjs/common` and `reflect-metadata` are required at runtime.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next steps after install</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <ul>
            <li>Choose `forRoot` for static configuration or `forRootAsync` for runtime/env-driven config.</li>
            <li>Pick one credential source: default chain, shared profile, or static access keys.</li>
            <li>Set optional S3 `defaultBucket` if most operations target a single bucket.</li>
            <li>Enable AWS SDK logger globally when you need request-level visibility.</li>
          </ul>
        </CardContent>
      </Card>

      <ExampleReference
        id="app.basic.module"
        description="Runnable Nest app example using static module configuration."
      />
      <ExampleReference
        id="app.basic.service"
        description="Runnable service usage in the static example app."
      />
      <ExampleReference
        id="app.async.module"
        description="Runnable Nest app example using async configuration."
      />
    </div>
  );
}
