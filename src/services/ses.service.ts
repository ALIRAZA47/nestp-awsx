import { Inject, Injectable } from "@nestjs/common";
import {
  SendEmailCommand,
  SendTemplatedEmailCommand,
  type SendEmailCommandInput,
  type SendEmailCommandOutput,
  type SendTemplatedEmailCommandInput,
  type SendTemplatedEmailCommandOutput,
  SESClient,
} from "@aws-sdk/client-ses";
import { AwsxToken } from "../constants";

@Injectable()
export class SesService {
  constructor(
    @Inject(AwsxToken.SesClient)
    private readonly client: SESClient,
  ) {}

  async sendEmail(params: SendEmailCommandInput): Promise<SendEmailCommandOutput> {
    return this.client.send(new SendEmailCommand(params));
  }

  async sendTextEmail(params: {
    from: string;
    to: string[];
    subject: string;
    text: string;
    cc?: string[];
    bcc?: string[];
    replyTo?: string[];
  }): Promise<SendEmailCommandOutput> {
    return this.sendEmail({
      Source: params.from,
      Destination: {
        ToAddresses: params.to,
        CcAddresses: params.cc,
        BccAddresses: params.bcc,
      },
      ReplyToAddresses: params.replyTo,
      Message: {
        Subject: { Data: params.subject },
        Body: { Text: { Data: params.text } },
      },
    });
  }

  async sendHtmlEmail(params: {
    from: string;
    to: string[];
    subject: string;
    html: string;
    textFallback?: string;
    cc?: string[];
    bcc?: string[];
    replyTo?: string[];
  }): Promise<SendEmailCommandOutput> {
    return this.sendEmail({
      Source: params.from,
      Destination: {
        ToAddresses: params.to,
        CcAddresses: params.cc,
        BccAddresses: params.bcc,
      },
      ReplyToAddresses: params.replyTo,
      Message: {
        Subject: { Data: params.subject },
        Body: {
          Html: { Data: params.html },
          Text: params.textFallback ? { Data: params.textFallback } : undefined,
        },
      },
    });
  }

  /**
   * Send an email using an SES template (e.g. welcome, password reset).
   * TemplateData must be a JSON-serializable object; it is stringified for the API.
   */
  async sendTemplatedEmail(
    params: Omit<SendTemplatedEmailCommandInput, "TemplateData"> & {
      template: string;
      templateData: Record<string, unknown>;
    },
  ): Promise<SendTemplatedEmailCommandOutput> {
    const { template, templateData, ...rest } = params;
    return this.client.send(
      new SendTemplatedEmailCommand({
        ...rest,
        Template: template,
        TemplateData: JSON.stringify(templateData),
      }),
    );
  }
}
