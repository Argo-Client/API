import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CommitDocument = Commit & Document;

@Schema()
export class CommitAuthor {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  avatar: string;
}

@Schema()
export class Commit {
  @Prop({ required: true })
  author: CommitAuthor;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  pending: boolean;

  @Prop()
  success?: boolean;

  @Prop()
  download?: string;
}

export const CommitSchema = SchemaFactory.createForClass(Commit);
