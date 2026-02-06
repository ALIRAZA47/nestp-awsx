import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/health")
  health() {
    return { ok: true };
  }

  @Get("/ses-sample")
  async sendWelcome() {
    return this.appService.sendWelcome();
  }
}
