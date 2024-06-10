import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  certificate: string;

  @Prop()
  password: string;

  @Prop()
  created_at: string;

  @Prop()
  updated_at?: string;

  @Prop()
  deleted_at?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
