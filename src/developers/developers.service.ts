import { Developer, DeveloperDocument } from "./schemas/developer.schema";

import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

@Injectable()
export class DevelopersService {
	constructor(
		@InjectModel(Developer.name)
		private developerModel: Model<DeveloperDocument>,
	) {}

	async get(type: "developer" | "contributor") {
		return await this.developerModel.find({ type });
	}

	async add(developer: Developer) {
		await this.developerModel.create(developer);
	}
}
