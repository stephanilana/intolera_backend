import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CertificationDocument = HydratedDocument<Certification>;

@Schema()
export class Certification {
  @Prop()
  id_user: string;

  @Prop()
  certification: string;

  @Prop()
  valid_certification: boolean;

  @Prop()
  created_at: string;

  @Prop()
  updated_at?: string;

  @Prop()
  deleted_at?: string;
}

export const CertificationSchema = SchemaFactory.createForClass(Certification);
