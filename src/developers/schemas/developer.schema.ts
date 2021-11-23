import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document } from "mongoose";

export type DeveloperDocument = Developer & Document;

@Schema()
export class Links {
	@Prop()
	github?: string;

	@Prop()
	website?: string;

	@Prop()
	twitter?: string;
}

@Schema()
export class Developer {
	@Prop({ required: true, unique: true })
	name: string;

	@Prop()
	links?: Links;

	@Prop({ required: true })
	type: "developer" | "contributor";
}

export const DeveloperSchema = SchemaFactory.createForClass(Developer);
