import { Inject, Injectable } from "@nestjs/common";
import {
  DeleteMessageCommand,
  PurgeQueueCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  type DeleteMessageCommandInput,
  type PurgeQueueCommandInput,
  type ReceiveMessageCommandInput,
  type ReceiveMessageCommandOutput,
  type SendMessageCommandInput,
  type SendMessageCommandOutput,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { AwsxToken } from "../constants";

@Injectable()
export class SqsService {
  constructor(
    @Inject(AwsxToken.SqsClient)
    private readonly client: SQSClient,
  ) {}

  async sendMessage(params: SendMessageCommandInput): Promise<SendMessageCommandOutput> {
    return this.client.send(new SendMessageCommand(params));
  }

  async receiveMessages(params: ReceiveMessageCommandInput): Promise<ReceiveMessageCommandOutput> {
    return this.client.send(new ReceiveMessageCommand(params));
  }

  async deleteMessage(params: DeleteMessageCommandInput) {
    return this.client.send(new DeleteMessageCommand(params));
  }

  async purgeQueue(params: PurgeQueueCommandInput) {
    return this.client.send(new PurgeQueueCommand(params));
  }
}
