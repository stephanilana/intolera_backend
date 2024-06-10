import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PasswordDocument = HydratedDocument<Password>;

@Schema()
export class Password {
  @Prop()
  id_user: string;

  @Prop()
  password: string;

  @Prop()
  created_at: string;

  @Prop()
  updated_at?: string;

  @Prop()
  deleted_at?: string;
}

export const PasswordSchema = SchemaFactory.createForClass(Password);
