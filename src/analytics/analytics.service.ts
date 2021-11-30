import { Analytics, AnalyticsDocument } from "./schemas/analytics.schema";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Model, Error as MongooseError } from "mongoose";

import { InjectModel } from "@nestjs/mongoose";
import { UpdateData } from "./interfaces/app";

@Injectable()
export class AnalyticsService {
	constructor(
		@InjectModel(Analytics.name)
		private analyticsModel: Model<AnalyticsDocument>,
	) {}

	async fetchStats() {
		const count = await this.analyticsModel.count();

		const android = await this.analyticsModel
			.find({
				"device.type": "android",
			})
			.count();

		const ios = await this.analyticsModel
			.find({
				"device.type": "ios",
			})
			.count();

		return { users: { total: count, android, ios }, lastUpdated: new Date() };
	}

	async initializeData(optIn?: boolean, id?: string) {
		const user = new this.analyticsModel({
			optIn,
			user: { id },
			lastUpdated: new Date(),
		});

		const error: MongooseError = await user.save().catch((e) => e);

		if (error.message) {
			throw new BadRequestException(error.message);
		}

		return { success: true };
	}

	async updateData(analytics: UpdateData) {
		const user = await this.analyticsModel.findOneAndUpdate(
			{
				"user.id": analytics.user.id,
			},
			analytics,
		);

		if (!user) {
			throw new BadRequestException(
				`Could not find user with id \`${analytics.user.id}\``,
			);
		}

		return { success: true };
	}
}
