import { Module } from "@nestjs/common";
import { BuilderController } from "./builder.controller";
import { AdminGuard } from "../admin.guard";
import { BuilderService } from "./builder.service";
import { WebhookGuard } from "./webhook.guard";

import { CommitsModule } from "../commits/commits.module";

@Module({
  imports: [CommitsModule],
  providers: [AdminGuard, WebhookGuard, BuilderService],
  controllers: [BuilderController],
})
export class BuilderModule {}
