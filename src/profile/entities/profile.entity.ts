import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ProfileDocument = HydratedDocument<Profile>;

@Schema()
export class Profile {
  @Prop()
  id_user: string;

  @Prop()
  description: string;

  @Prop()
  profile_picture: string;

  @Prop()
  created_at: string;

  @Prop()
  updated_at?: string;

  @Prop()
  deleted_at?: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
