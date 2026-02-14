import { Injectable } from "@nestjs/common";
import { SesService } from "@nestp/awsx";

@Injectable()
export class SesHelperExampleService {
  constructor(private readonly ses: SesService) {}

  async sendTransactionalEmails() {
    await this.ses.sendTextEmail({
      from: "team@example.com",
      to: ["user@example.com"],
      subject: "Plain text email",
      text: "Hello from AWSX",
    });

    await this.ses.sendHtmlEmail({
      from: "team@example.com",
      to: ["user@example.com"],
      subject: "HTML email",
      html: "<h1>Hello</h1><p>This is HTML content.</p>",
      textFallback: "Hello - this is fallback text.",
    });
  }
}
