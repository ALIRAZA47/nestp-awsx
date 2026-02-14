import { DocHeader } from "@/components/doc-header";
import { ExampleReference } from "@/components/example-reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CredentialsPage() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Configuration"
        title="Credentials"
        description="AWSX supports default credential provider chain, shared config profiles, and explicit static credentials for both global and per-service scopes."
      />

      <Card>
        <CardHeader>
          <CardTitle>Supported credential sources</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <ul>
            <li><span className="font-semibold text-foreground">Default:</span> AWS SDK provider chain (env vars, shared files, IAM role metadata).</li>
            <li><span className="font-semibold text-foreground">Profile:</span> shared credential/profile name from local AWS config files.</li>
            <li><span className="font-semibold text-foreground">Static:</span> explicit `accessKeyId`, `secretAccessKey`, optional `sessionToken`.</li>
          </ul>
          <p>Set one global source, then override only the services that need different credentials.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>When to use which mode</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <ul>
            <li>Use `Default` for ECS, EC2, Lambda, and most local development setups.</li>
            <li>Use `Profile` for local multi-account workflows.</li>
            <li>Use `Static` only when key material is already managed securely by your app platform.</li>
          </ul>
        </CardContent>
      </Card>

      <ExampleReference id="credentials.default" description="Global default provider chain." />
      <ExampleReference id="credentials.profile" description="Global shared profile credentials." />
      <ExampleReference id="credentials.static" description="Global static access key credentials." />
    </div>
  );
}
