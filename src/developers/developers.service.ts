import {  Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";

import { Developer, DeveloperDocument } from "./schemas/developer.schema";

@Injectable()
export class DevelopersService {
  constructor(
    @InjectModel(Developer.name)
    private developerModel: Model<DeveloperDocument>
  ) {}

 async get(type: "developer" | "contributor") {
    return await this.developerModel.find({ type });
  }

  async add(developer: Developer) {
    await this.developerModel.create(developer)
  }
}
