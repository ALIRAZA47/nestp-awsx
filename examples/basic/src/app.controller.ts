import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/health")
  health() {
    return { ok: true };
  }

  @Get("/s3-sample")
  async uploadSample() {
    return this.appService.uploadSample();
  }

  @Get("/sqs-sample")
  async sendMessage() {
    return this.appService.sendMessage();
  }
}
