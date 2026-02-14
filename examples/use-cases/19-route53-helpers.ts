import { Injectable } from "@nestjs/common";
import { Route53Service } from "@nestp/awsx";

@Injectable()
export class Route53HelperExampleService {
  constructor(private readonly route53: Route53Service) {}

  async upsertDnsRecords() {
    await this.route53.upsertARecord({
      zoneId: "Z0123456789",
      name: "api.example.com",
      values: ["203.0.113.12"],
      ttl: 60,
    });

    await this.route53.upsertTxtRecord({
      zoneId: "Z0123456789",
      name: "_acme-challenge.example.com",
      values: ['"challenge-token"'],
    });
  }
}
