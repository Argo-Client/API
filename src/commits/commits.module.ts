import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommitsController } from "./commits.controller";
import { CommitsService } from "./commits.service";
import { Commit, CommitSchema } from "./schemas/commit.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Commit.name, schema: CommitSchema }]),
    CacheModule.register({ ttl: 10 }),
  ],
  providers: [CommitsService, CommitsController],
  controllers: [CommitsController],
  exports: [CommitsService],
})
export class CommitsModule {}
