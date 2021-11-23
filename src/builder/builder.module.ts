import { AdminGuard } from "../admin.guard";
import { BuilderController } from "./builder.controller";
import { BuilderService } from "./builder.service";
import { CommitsModule } from "../commits/commits.module";
import { Module } from "@nestjs/common";
import { WebhookGuard } from "./webhook.guard";

@Module({
	imports: [CommitsModule],
	providers: [AdminGuard, WebhookGuard, BuilderService],
	controllers: [BuilderController],
})
export class BuilderModule {}
