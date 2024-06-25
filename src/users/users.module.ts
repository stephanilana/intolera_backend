import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { JwtModule } from "@nestjs/jwt";
import { CertificationModule } from "src/certification/certification.module";
import { FollowerModule } from "src/follower/follower.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: "@zv5sZ:9Q5p2",
        signOptions: { expiresIn: "7d" },
      }),
    }),
    CertificationModule,
    FollowerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
