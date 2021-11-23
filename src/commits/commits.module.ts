import { CacheModule, Module } from "@nestjs/common";
import { Commit, CommitSchema } from "./schemas/commit.schema";

import { CommitsController } from "./commits.controller";
import { CommitsService } from "./commits.service";
import { MongooseModule } from "@nestjs/mongoose";

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
