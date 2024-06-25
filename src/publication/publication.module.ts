import { Module } from "@nestjs/common";
import { PublicationService } from "./publication.service";
import { PublicationController } from "./publication.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Publication, PublicationSchema } from "./entities/publication.entity";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: Publication.name, schema: PublicationSchema }]), UsersModule],
  controllers: [PublicationController],
  providers: [PublicationService],
})
export class PublicationModule {}
