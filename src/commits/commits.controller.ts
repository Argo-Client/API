import {
  BadRequestException,
  CacheInterceptor,
  Controller,
  Get,
  Req,
  UseInterceptors,
} from "@nestjs/common";

import { Request } from "express";

import { CommitsService } from "./commits.service";

@Controller("commits")
export class CommitsController {
  constructor(private commitsService: CommitsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  fetchCommits(@Req() req: Request) {
    const limit = req.query.limit;
    const page = req.query.page;

    if (!limit || !page) {
      throw new BadRequestException("Missing limit or page query parameter");
    }

    return this.commitsService.fetch(
      parseInt(limit as string),
      parseInt(page as string)
    );
  }
}
