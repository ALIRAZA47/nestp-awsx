import { Inject, Injectable } from "@nestjs/common";
import {
  PutEventsCommand,
  PutRuleCommand,
  PutTargetsCommand,
  type PutEventsCommandInput,
  type PutEventsCommandOutput,
  type PutRuleCommandInput,
  type PutRuleCommandOutput,
  type PutTargetsCommandInput,
  type PutTargetsCommandOutput,
  EventBridgeClient,
} from "@aws-sdk/client-eventbridge";
import { AwsxToken } from "../constants";

@Injectable()
export class EventBridgeService {
  constructor(
    @Inject(AwsxToken.EventBridgeClient)
    private readonly client: EventBridgeClient,
  ) {}

  async putEvents(params: PutEventsCommandInput): Promise<PutEventsCommandOutput> {
    return this.client.send(new PutEventsCommand(params));
  }

  /**
   * Send a single event to the default (or specified) event bus.
   * Detail is JSON-stringified if it is an object.
   */
  async putEvent(params: {
    Source: string;
    DetailType: string;
    Detail: string | Record<string, unknown>;
    EventBusName?: string;
    Time?: Date;
    Resources?: string[];
    TraceHeader?: string;
  }): Promise<PutEventsCommandOutput> {
    const Detail =
      typeof params.Detail === "string" ? params.Detail : JSON.stringify(params.Detail);
    return this.putEvents({
      Entries: [
        {
          Source: params.Source,
          DetailType: params.DetailType,
          Detail,
          EventBusName: params.EventBusName,
          Time: params.Time,
          Resources: params.Resources,
          TraceHeader: params.TraceHeader,
        },
      ],
    });
  }

  async putRule(params: PutRuleCommandInput): Promise<PutRuleCommandOutput> {
    return this.client.send(new PutRuleCommand(params));
  }

  async putTargets(params: PutTargetsCommandInput): Promise<PutTargetsCommandOutput> {
    return this.client.send(new PutTargetsCommand(params));
  }
}
