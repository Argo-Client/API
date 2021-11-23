import {
	BadRequestException,
	CacheInterceptor,
	Controller,
	Get,
	Req,
	Res,
	UseInterceptors,
} from "@nestjs/common";
import { Request, Response } from "express";

import { CommitsService } from "./commits.service";

@Controller("commits")
export class CommitsController {
	constructor(private commitsService: CommitsService) {}

	@Get()
	@UseInterceptors(CacheInterceptor)
	async fetchCommits(@Req() req: Request, @Res() res: Response) {
		const limit = parseInt(req.query.limit as string) || 5;
		const page = parseInt(req.query.page as string) || 0;

		const host = req.hostname;

		if (limit > 100 || limit <= 0) {
			throw new BadRequestException("Limit parameter is not a valid number");
		}

		if (!host) {
			throw new BadRequestException("You must have a `host` header");
		}

		const [commits, length] = await this.commitsService.fetch(limit, page, [
			host,
			req.protocol,
		]);

		res.set("X-Total-Commits", length.toString());

		res.json(commits);
	}
}
