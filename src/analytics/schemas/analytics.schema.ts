import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { Document } from "mongoose";

export type AnalyticsDocument = Analytics & Document;

@Schema()
class User {
	@Prop()
	school: string;

	@Prop({ required: true, unique: true })
	id: string;
}

@Schema()
class Device {
	@Prop()
	type: "android" | "ios";

	@Prop()
	version: string;
}

@Schema()
class App {
	@Prop()
	version: string;

	@Prop()
	source: "playstore" | "github";
}

@Schema()
export class Analytics {
	@Prop({ required: true })
	optIn: boolean;

	@Prop({ required: true })
	user: User;

	@Prop()
	device: Device;

	@Prop()
	app: App;

	@Prop()
	lastUpdated: Date;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
