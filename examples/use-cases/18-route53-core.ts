import { Injectable } from "@nestjs/common";
import {
  AwsxRoute53ChangeAction,
  AwsxRoute53RecordType,
  Route53Service,
} from "@nestp/awsx";

@Injectable()
export class Route53CoreExampleService {
  constructor(private readonly route53: Route53Service) {}

  async updateRecords() {
    await this.route53.listHostedZones({});

    await this.route53.changeRecordSets({
      HostedZoneId: "Z0123456789",
      ChangeBatch: {
        Changes: [
          {
            Action: AwsxRoute53ChangeAction.Upsert,
            ResourceRecordSet: {
              Name: "api.example.com",
              Type: AwsxRoute53RecordType.A,
              TTL: 60,
              ResourceRecords: [{ Value: "203.0.113.12" }],
            },
          },
        ],
      },
    });
  }
}
