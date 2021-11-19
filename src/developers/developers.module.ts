import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { DevelopersController } from "./developers.controller";
import { Developer, DeveloperSchema } from "./schemas/developer.schema";
import { DevelopersService } from "./developers.service";

import { AdminGuard } from "../admin.guard";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Developer.name, schema: DeveloperSchema },
    ]),
    AdminGuard
  ],
  controllers: [DevelopersController],
  providers: [DevelopersService],
})
export class DevelopersModule {}
