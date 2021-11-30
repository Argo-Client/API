import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Req,
	UseGuards,
} from "@nestjs/common";

import { AdminGuard } from "../admin.guard";
import { Developer } from "./schemas/developer.schema";
import { DevelopersService } from "./developers.service";
import { Request } from "express";

@Controller("developers")
export class DevelopersController {
	constructor(private developersService: DevelopersService) {}

	@Get()
	getAll(@Req() req: Request) {
		if (!req.get("Host")) {
			throw new BadRequestException("You must have a `host` header");
		}

		const version = "v" + 1;

		const baseURL = `${req.protocol}://${req.get(
			"Host",
		)}/${version}/developers`;

		return {
			developers: `${baseURL}/main`,
			contributors: `${baseURL}/contributors`,
		};
	}

	@Get("main")
	getDevelopers() {
		return this.developersService.get("developer");
	}

	@Get("contributors")
	getContributors() {
		return this.developersService.get("contributor");
	}

	@Post("new")
	@UseGuards(AdminGuard)
	async addDeveloper(
		@Body()
		developer: Developer,
	) {
		const error = await this.developersService.add(developer).catch((e) => e);

		if (error) {
			throw new BadRequestException(error.message);
		}

		return {
			success: "Added new developer to database",
		};
	}
}
