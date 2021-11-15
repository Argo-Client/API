import { Module } from "@nestjs/common";
import { BuilderController } from "./builder.controller";
import { BuilderGuard } from "./builder.guard";
import { BuilderService } from "./builder.service";
import { WebhookGuard } from "./webhook.guard";

import { CommitsModule } from "../commits/commits.module";

@Module({
  imports: [CommitsModule],
  providers: [BuilderGuard, WebhookGuard, BuilderService],
  controllers: [BuilderController],
})
export class BuilderModule {}
