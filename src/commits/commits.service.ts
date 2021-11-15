import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Commit, CommitDocument } from "./schemas/commit.schema";

@Injectable()
export class CommitsService {
  constructor(
    @InjectModel(Commit.name) private commitModel: Model<CommitDocument>
  ) {}

  async insert(commit: Commit) {
    await this.commitModel.create(commit).catch((e) => {
      throw new InternalServerErrorException(e);
    });
  }

  async update(id: string, updated: any) {
    await this.commitModel.findOneAndUpdate({ id }, updated);
  }

  async fetch(limit: number, page: number): Promise<Commit[]> {
    const commits = await this.commitModel.find();

    return commits
      .slice(page * limit, page * limit + limit)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}
