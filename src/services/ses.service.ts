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
}
