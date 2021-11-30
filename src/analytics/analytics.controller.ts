import {
	Body,
	CacheInterceptor,
	Controller,
	Get,
	Post,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { PreferenceData, UpdateData } from "./interfaces/app";

import { AnalyticsService } from "./analytics.service";
import { AppGuard } from "./app.guard";

@Controller("analytics")
export class AnalyticsController {
	constructor(private analyticsService: AnalyticsService) {}

	@Get("stats")
	@UseInterceptors(CacheInterceptor)
	async getPublicStats() {
		return await this.analyticsService.fetchStats();
	}

	@Post("app/initial")
	@UseGuards(AppGuard)
	async initialize(@Body() body: PreferenceData) {
		return await this.analyticsService.initializeData(
			body.optIn,
			body.user?.id,
		);
	}

	@Post("app/update")
	@UseGuards(AppGuard)
	async update(@Body() body: UpdateData) {
		return await this.analyticsService.updateData(body);
	}
}
