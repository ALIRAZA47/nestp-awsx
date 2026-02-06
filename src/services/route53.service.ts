import { Inject, Injectable } from "@nestjs/common";
import {
  ChangeResourceRecordSetsCommand,
  ListHostedZonesCommand,
  type ChangeResourceRecordSetsCommandInput,
  type ChangeResourceRecordSetsCommandOutput,
  type ListHostedZonesCommandInput,
  type ListHostedZonesCommandOutput,
  Route53Client,
} from "@aws-sdk/client-route-53";
import { AwsxToken } from "../constants";

@Injectable()
export class Route53Service {
  constructor(
    @Inject(AwsxToken.Route53Client)
    private readonly client: Route53Client,
  ) {}

  async changeRecordSets(
    params: ChangeResourceRecordSetsCommandInput,
  ): Promise<ChangeResourceRecordSetsCommandOutput> {
    return this.client.send(new ChangeResourceRecordSetsCommand(params));
  }

  async listHostedZones(
    params: ListHostedZonesCommandInput,
  ): Promise<ListHostedZonesCommandOutput> {
    return this.client.send(new ListHostedZonesCommand(params));
  }

  async upsertARecord(params: {
    zoneId: string;
    name: string;
    values: string[];
    ttl?: number;
  }): Promise<ChangeResourceRecordSetsCommandOutput> {
    return this.changeRecordSets({
      HostedZoneId: params.zoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: "UPSERT",
            ResourceRecordSet: {
              Name: params.name,
              Type: "A",
              TTL: params.ttl ?? 60,
              ResourceRecords: params.values.map((value) => ({ Value: value })),
            },
          },
        ],
      },
    });
  }

  async upsertTxtRecord(params: {
    zoneId: string;
    name: string;
    values: string[];
    ttl?: number;
  }): Promise<ChangeResourceRecordSetsCommandOutput> {
    return this.changeRecordSets({
      HostedZoneId: params.zoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: "UPSERT",
            ResourceRecordSet: {
              Name: params.name,
              Type: "TXT",
              TTL: params.ttl ?? 300,
              ResourceRecords: params.values.map((value) => ({ Value: value })),
            },
          },
        ],
      },
    });
  }
}
