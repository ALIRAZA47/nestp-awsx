import { DocHeader } from "@/components/doc-header";
import { ExampleReference } from "@/components/example-reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Route53Page() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Services"
        title="Route53 Service"
        description="`Route53Service` wraps hosted zone listing and record changes, with helpers for A/TXT upsert flows."
      />

      <Card>
        <CardHeader>
          <CardTitle>Method coverage</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <p>Core methods: `listHostedZones` and `changeRecordSets`.</p>
          <p>Helpers: `upsertARecord` and `upsertTxtRecord` for common DNS update workflows.</p>
          <p>Helpers generate UPSERT change sets with sensible TTL defaults.</p>
        </CardContent>
      </Card>

      <ExampleReference id="route53.core" />
      <ExampleReference id="route53.helpers" />
    </div>
  );
}
