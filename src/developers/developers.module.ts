import { Developer, DeveloperSchema } from "./schemas/developer.schema";

import { AdminGuard } from "../admin.guard";
import { DevelopersController } from "./developers.controller";
import { DevelopersService } from "./developers.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Developer.name, schema: DeveloperSchema },
		]),
		AdminGuard,
	],
	controllers: [DevelopersController],
	providers: [DevelopersService],
})
export class DevelopersModule {}
