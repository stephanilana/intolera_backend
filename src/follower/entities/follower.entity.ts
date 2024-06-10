import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type FollowerDocument = HydratedDocument<Follower>;

@Schema()
export class Follower {
  @Prop()
  id_user_follower: string;

  @Prop()
  id_user_followed: string;

  @Prop()
  acepted: boolean;

  @Prop()
  created_at: string;

  @Prop()
  updated_at?: string;

  @Prop()
  deleted_at?: string;
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);
