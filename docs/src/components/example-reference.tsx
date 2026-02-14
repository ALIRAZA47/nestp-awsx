import { FileCode } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { exampleSnippets, type ExampleId } from "@/lib/examples";

type ExampleReferenceProps = {
  id: ExampleId;
  description?: string;
};

const moduleLikeExamples = new Set<ExampleId>([
  "module.forRoot",
  "module.forRootAsync.factory",
  "module.forRootAsync.class",
  "credentials.default",
  "credentials.profile",
  "credentials.static",
  "clients.logger",
  "s3.defaultBucket",
  "override.service",
  "app.basic.module",
  "app.async.module",
]);

const resolveDisplayFileName = (id: ExampleId, sourcePath: string): string => {
  if (sourcePath.endsWith(".md")) {
    return sourcePath.split("/").pop() ?? "README.md";
  }
  if (id === "override.service") {
    return "custom-s3.module.ts";
  }
  if (moduleLikeExamples.has(id)) {
    return "awsx.module.ts";
  }
  return "awsx-example.service.ts";
};

export function ExampleReference({ id, description }: ExampleReferenceProps) {
  const snippet = exampleSnippets[id];
  const displayFileName = resolveDisplayFileName(id, snippet.filePath);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileCode className="h-4 w-4" />
          {snippet.title}
        </CardTitle>
        <CardDescription>
          <span className="font-mono text-xs text-muted-foreground">{snippet.filePath}</span>
        </CardDescription>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <CodeBlock
          code={snippet.code}
          language={snippet.filePath.endsWith(".md") ? "md" : "ts"}
          fileName={displayFileName}
        />
      </CardContent>
    </Card>
  );
}
