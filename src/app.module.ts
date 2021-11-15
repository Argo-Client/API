import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { BuilderModule } from "./builder/builder.module";
import { CommitsModule } from "./commits/commits.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASSWORD,
    }),
    BuilderModule,
    CommitsModule,
  ],
})
export class AppModule {}
