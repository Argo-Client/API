import { Analytics, AnalyticsSchema } from "./schemas/analytics.schema";
import { CacheModule, Module } from "@nestjs/common";

import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";
import { AppGuard } from "./app.guard";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Analytics.name, schema: AnalyticsSchema },
		]),
		CacheModule.register({ ttl: 60 }),
	],
	controllers: [AnalyticsController],
	providers: [AppGuard, AnalyticsService],
})
export class AnalyticsModule {}
