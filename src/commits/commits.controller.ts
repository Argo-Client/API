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
    const limit = parseInt(req.query.limit as string) || 5;
    const page = parseInt(req.query.page as string) || 0;

    return this.commitsService.fetch(limit, page);
  }
}
