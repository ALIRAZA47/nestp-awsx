import { DocHeader } from "@/components/doc-header";
import { ExampleReference } from "@/components/example-reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ConfigurationPage() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Configuration"
        title="Core Configuration"
        description="Configure the module through `forRoot` or `forRootAsync`. All configuration lands in one typed object with global defaults and per-service overrides."
      />

      <Card>
        <CardHeader>
          <CardTitle>Configuration model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p><span className="font-semibold text-foreground">`defaults`</span> handles shared behavior such as region, max attempts, and optional global logger.</p>
          <p><span className="font-semibold text-foreground">`global`</span> defines global credentials fallback for all services.</p>
          <p><span className="font-semibold text-foreground">`services`</span> allows per-service region, endpoint, credentials and S3 `defaultBucket`.</p>
          <Separator />
          <p>Use enum keys (`AwsxServiceKey`, `AwsxCredentialSource`) instead of magic strings while building config objects.</p>
          <p>Use `forRoot` for static config and `forRootAsync` when values come from environment config, secrets manager, or runtime providers.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Precedence rules</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <ul>
            <li>Service credentials override global credentials for only that service.</li>
            <li>Service region overrides global/default region for only that service.</li>
            <li>S3 `defaultBucket` is used whenever a bucket is required and not passed at call-time.</li>
            <li>Client config values from `services[*].client` merge with normalized defaults.</li>
          </ul>
        </CardContent>
      </Card>

      <ExampleReference id="module.forRoot" description="Static config with explicit service keys." />
      <ExampleReference id="module.forRootAsync.factory" description="Async config via `useFactory` and injected `ConfigService`." />
      <ExampleReference id="module.forRootAsync.class" description="Async config via `useClass` implementing `AwsxConfigFactory`." />
      <ExampleReference id="clients.logger" description="Enable and provide global AWS client logger." />
      <ExampleReference id="s3.defaultBucket" description="Set `defaultBucket` to avoid passing bucket every S3 call." />
    </div>
  );
}
