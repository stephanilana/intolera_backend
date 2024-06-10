import { Module } from "@nestjs/common";
import { PublicationService } from "./publication.service";
import { PublicationController } from "./publication.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Publication, PublicationSchema } from "./entities/publication.entity";

@Module({
  imports: [MongooseModule.forFeature([{ name: Publication.name, schema: PublicationSchema }])],
  controllers: [PublicationController],
  providers: [PublicationService],
})
export class PublicationModule {}
