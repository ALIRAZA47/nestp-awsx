import { Injectable } from "@nestjs/common";
import { SesService } from "@nestp/awsx";

@Injectable()
export class AppService {
  constructor(private readonly ses: SesService) {}

  async sendWelcome() {
    return this.ses.sendEmail({
      Source: "team@company.com",
      Destination: { ToAddresses: ["user@company.com"] },
      Message: {
        Subject: { Data: "Welcome" },
        Body: { Text: { Data: "Hello there" } },
      },
    });
  }
}
