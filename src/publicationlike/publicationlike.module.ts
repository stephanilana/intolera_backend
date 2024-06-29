import { Module } from "@nestjs/common";
import { PublicationlikeService } from "./publicationlike.service";
import { PublicationlikeController } from "./publicationlike.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Publicationlike, PublicationlikeSchema } from "./entities/publicationlike.entity";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: Publicationlike.name, schema: PublicationlikeSchema }]), UsersModule],
  controllers: [PublicationlikeController],
  providers: [PublicationlikeService],
})
export class PublicationlikeModule {}
