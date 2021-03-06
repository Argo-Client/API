import { Commit, CommitDocument } from "./schemas/commit.schema";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CommitsService {
	constructor(
		@InjectModel(Commit.name) private commitModel: Model<CommitDocument>,
	) {}

	async insert(commit: Commit) {
		await this.commitModel.create(commit).catch((e) => {
			throw new InternalServerErrorException(e);
		});
	}

	async update(id: string, updated: any) {
		await this.commitModel.findOneAndUpdate({ id }, updated);
	}

	async fetch(
		limit: number,
		page: number,
		[host, protocol]: [string, string],
	): Promise<[Commit[], number]> {
		const commits = await this.commitModel.find();

		const downloadURL = `${protocol}://${host}/v1/builder/download/`;

		return [
			commits
				.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
				.slice(page * limit, page * limit + limit)
				.map((commit) => {
					if (commit.download)
						commit.download = downloadURL + commit.download.replace("/", "");

					return commit;
				}),
			commits.length,
		];
	}
}
