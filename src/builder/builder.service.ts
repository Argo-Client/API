import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Request } from "express";

import { ensureDir, writeFile } from "fs-extra";
import { join } from "path";

import { APK_DIR, GITHUB_EVENT_HEADER, MAX_FILE_SIZE } from "./constants";

import { GITHUB_EVENT_TYPE } from "../commits/interfaces/commit.interface";
import { CommitsService } from "../commits/commits.service";

@Injectable()
export class BuilderService {
  private readonly logger = new Logger(BuilderService.name);

  constructor(private commitsService: CommitsService) {}

  private readonly fileExtensions = ["apk", "snap"];

  async handleFileUpload(file: Express.Multer.File, request: Request) {
    const fileExtension = file.originalname.split(".").pop();

    if (this.fileExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `Filename must end with ${this.fileExtensions.join(" ")}`
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File can't be larger than \`${MAX_FILE_SIZE}\` bytes`
      );
    }

    if (!request.body.head_sha) {
      throw new BadRequestException(`Missing head_sha parameter in body`);
    }

    this.logger.log(`Got ${file.originalname} from ${request.ip}`);

    const apkDir = process.env.APK_DIR ?? APK_DIR;

    await ensureDir(apkDir);

    const fileName = `Argo-${Date.now()}.apk`;

    await writeFile(join(apkDir, fileName), file.buffer);

    await this.commitsService.update(request.body.head_sha, {
      success: true,
      pending: false,
      download: fileName,
    });

    return { sucess: "File uploaded" };
  }

  async handleWebhook(req: Request) {
    const payload = JSON.parse(req.body.payload);

    if (req.get(GITHUB_EVENT_HEADER) == GITHUB_EVENT_TYPE.PUSH) {
      const commit = payload.head_commit;

      await this.commitsService.insert({
        author: {
          username: payload.sender.login,
          avatar: payload.sender.avatar_url,
        },
        id: commit.id,
        message: commit.message,
        pending: true,
        timestamp: commit.timestamp,
      });

      return { success: "Inserted commit into database" };
    }

    if (req.get(GITHUB_EVENT_HEADER) == GITHUB_EVENT_TYPE.WORKFLOW) {
      if (
        payload?.action == "completed" &&
        payload?.workflow_job?.conclusion == "failure"
      ) {
        await this.commitsService.update(payload.head_sha, {
          success: false,
          pending: false,
        });

        return { success: "Updated commit in database" };
      }
    }
  }
}
