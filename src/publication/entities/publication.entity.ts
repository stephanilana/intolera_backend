import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PublicationDocument = HydratedDocument<Publication>;

@Schema()
export class Publication {
  @Prop()
  id_user: string;

  @Prop()
  id_like: string;

  @Prop()
  picture_publication: string;

  @Prop()
  text: string;

  @Prop()
  certificated_user: boolean;

  @Prop()
  created_at: string;

  @Prop()
  updated_at?: string;

  @Prop()
  deleted_at?: string;
}

export const PublicationSchema = SchemaFactory.createForClass(Publication);
