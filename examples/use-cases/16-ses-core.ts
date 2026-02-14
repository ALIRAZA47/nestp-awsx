import { Injectable } from "@nestjs/common";
import { SesService } from "@nestp/awsx";

@Injectable()
export class SesCoreExampleService {
  constructor(private readonly ses: SesService) {}

  async sendWelcomeEmail() {
    return this.ses.sendEmail({
      Source: "team@example.com",
      Destination: { ToAddresses: ["user@example.com"] },
      Message: {
        Subject: { Data: "Welcome" },
        Body: { Text: { Data: "Welcome to the app" } },
      },
    });
  }
}
