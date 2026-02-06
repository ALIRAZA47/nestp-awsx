import { Inject, Injectable } from "@nestjs/common";
import {
  SendEmailCommand,
  type SendEmailCommandInput,
  type SendEmailCommandOutput,
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
}
