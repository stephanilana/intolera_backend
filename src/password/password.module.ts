import { Module } from "@nestjs/common";
import { PasswordService } from "./password.service";
import { PasswordController } from "./password.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Password, PasswordSchema } from "./entities/password.entity";

@Module({
  imports: [MongooseModule.forFeature([{ name: Password.name, schema: PasswordSchema }])],
  controllers: [PasswordController],
  providers: [PasswordService],
})
export class PasswordModule {}
