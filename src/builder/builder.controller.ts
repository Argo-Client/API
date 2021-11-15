import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { Request, Response } from "express";
import { createReadStream } from "fs-extra";
import { join } from "path";

import { BuilderGuard } from "./builder.guard";
import { BuilderService } from "./builder.service";
import { APK_DIR } from "./constants";
import { WebhookGuard } from "./webhook.guard";

@Controller("builder")
export class BuilderController {
  constructor(private builderService: BuilderService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("apk"))
  @UseGuards(BuilderGuard)
  async receiveAPKFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    if (!file) {
      throw new BadRequestException("You must include a file to upload.");
    }

    return await this.builderService.handleFileUpload(file, req);
  }

  @Get("download/:file")
  getAPKFile(@Res() res: Response, @Param() params) {
    const file = createReadStream(
      join(process.env.APK_DIR ?? APK_DIR, params.file)
    );

    res.setHeader("Content-Type", "application/vnd.android.package-archive");

    file.pipe(res);
  }

  @Post("webhook")
  @UseGuards(WebhookGuard)
  async receiveWebhook(@Req() req: Request) {
    return await this.builderService.handleWebhook(req);
  }
}