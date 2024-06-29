import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PublicationlikeDocument = HydratedDocument<Publicationlike>;

@Schema()
export class Publicationlike {
  @Prop()
  id_publication: string;

  @Prop()
  id_user: string;

  @Prop()
  created_at: string;

  @Prop()
  updated_at?: string;

  @Prop()
  deleted_at?: string;
}

export const PublicationlikeSchema = SchemaFactory.createForClass(Publicationlike);
