import { DocHeader } from "@/components/doc-header";
import { ExampleReference } from "@/components/example-reference";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SesPage() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Services"
        title="SES Service"
        description="`SesService` includes direct `sendEmail` plus high-level text/html helpers to reduce boilerplate for common outbound email flows."
      />

      <Card>
        <CardHeader>
          <CardTitle>Method coverage</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <p>Core: `sendEmail` with full AWS SES request support.</p>
          <p>Helpers: `sendTextEmail` and `sendHtmlEmail` for faster transactional-email setup.</p>
          <p>Helper methods still map cleanly to SES input fields (`Source`, `Destination`, `Message`).</p>
        </CardContent>
      </Card>

      <ExampleReference id="ses.core" />
      <ExampleReference id="ses.helpers" />
    </div>
  );
}
