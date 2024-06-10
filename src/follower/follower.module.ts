import { Module } from "@nestjs/common";
import { FollowerService } from "./follower.service";
import { FollowerController } from "./follower.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Follower, FollowerSchema } from "./entities/follower.entity";

@Module({
  imports: [MongooseModule.forFeature([{ name: Follower.name, schema: FollowerSchema }])],
  controllers: [FollowerController],
  providers: [FollowerService],
})
export class FollowerModule {}
