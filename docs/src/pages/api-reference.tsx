import { DocHeader } from "@/components/doc-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";

const enums = `AwsxServiceKey:
- S3
- Sqs
- Ses
- Route53

AwsxCredentialSource:
- Default
- Profile
- Static

AwsxS3SignedUrlOperation:
- GetObject
- PutObject

AwsxRoute53ChangeAction:
- Create
- Delete
- Upsert

AwsxRoute53RecordType:
- A
- Txt`;

const exportedSymbols = `AwsxModule
AwsxService
AwsxToken
AwsxCredentialSource
AwsxServiceKey
AwsxS3SignedUrlOperation
AwsxRoute53ChangeAction
AwsxRoute53RecordType
AwsxConsoleLogger
S3Service
SqsService
SesService
Route53Service

Types:
AwsxAsyncOptions
AwsxConfig
AwsxConfigFactory
AwsxCredentialConfig
AwsxDefaults
AwsxServiceConfig`;

const s3Methods = `putObject
getObject
deleteObject
listObjects
listKeys
exists
putJson
getJson
getSignedUrl
deleteMany
putMany
uploadWithProgress`;

const sqsMethods = `sendMessage
sendJson
receiveMessages
receiveJson
deleteMessage
purgeQueue
sendBatch
sendJsonBatch
deleteBatch`;

const sesMethods = `sendEmail
sendTextEmail
sendHtmlEmail`;

const route53Methods = `changeRecordSets
listHostedZones
upsertARecord
upsertTxtRecord`;

export function ApiReferencePage() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Tooling"
        title="API Reference"
        description="Complete exported API surface from `@nestp/awsx`."
      />

      <Card>
        <CardHeader>
          <CardTitle>Core enums</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock code={enums} language="txt" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Package exports</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock code={exportedSymbols} language="txt" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>S3Service methods</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock code={s3Methods} language="txt" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SqsService methods</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock code={sqsMethods} language="txt" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SesService methods</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock code={sesMethods} language="txt" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Route53Service methods</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock code={route53Methods} language="txt" />
        </CardContent>
      </Card>
    </div>
  );
}
