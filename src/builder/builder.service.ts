import {
	createApkFileName,
	getApkDir,
	GITHUB_EVENT_HEADER,
	MAX_FILE_SIZE,
} from "./constants";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ensureDir, writeFile } from "fs-extra";

import { CommitsService } from "../commits/commits.service";
import { GITHUB_EVENT_TYPE } from "../commits/interfaces/commit.interface";
import { Request } from "express";
import { join } from "path";

@Injectable()
export class BuilderService {
	private readonly logger = new Logger(BuilderService.name);

	constructor(private commitsService: CommitsService) {}

	private readonly fileExtensions = ["apk", "snap"];

	private isCorrectFileExtension(extension: string): boolean {
		return this.fileExtensions.filter((item) => item == extension).length != 0;
	}

	async handleFileUpload(file: Express.Multer.File, request: Request) {
		const fileExtension = file.originalname
			.split(".")
			.pop()
			.trim()
			.toLowerCase();

		if (!this.isCorrectFileExtension(fileExtension)) {
			throw new BadRequestException(
				`Filename must end with ${this.fileExtensions.join(", ")}`,
			);
		}

		if (file.size > MAX_FILE_SIZE) {
			throw new BadRequestException(
				`File can't be larger than \`${MAX_FILE_SIZE}\` bytes`,
			);
		}

		if (!request.body.head_sha) {
			throw new BadRequestException(`Missing head_sha parameter in body`);
		}

		this.logger.log(`Got ${file.originalname} from ${request.ip}`);

		const apkDir = getApkDir();

		await ensureDir(apkDir);

		const fileName = createApkFileName(fileExtension);

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

		switch (req.get(GITHUB_EVENT_HEADER)) {
			case GITHUB_EVENT_TYPE.PUSH:
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

			case GITHUB_EVENT_TYPE.WORKFLOW:
				if (payload?.action == "completed") {
					if (payload?.workflow_job?.conclusion == "failure") {
						await this.commitsService.update(payload.head_sha, {
							success: false,
							pending: false,
						});

						return { success: "Updated commit in database" };
					} else
						throw new BadRequestException(
							"Workflow conclusion is not failure, no new info",
						);
				}

				throw new BadRequestException("Workflow is not yet completed");

			default:
				throw new BadRequestException("Unknown Github event type");
		}
	}
}
