import { BuilderModule } from "./builder/builder.module";
import { CommitsModule } from "./commits/commits.module";
import { ConfigModule } from "@nestjs/config";
import { DevelopersModule } from "./developers/developers.module";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGO_URI, {
			user: process.env.MONGO_USER,
			pass: process.env.MONGO_PASSWORD,
		}),
		BuilderModule,
		CommitsModule,
		DevelopersModule,
	],
})
export class AppModule {}
