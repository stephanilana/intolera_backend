import { Module } from "@nestjs/common";
import { CertificationService } from "./certification.service";
import { CertificationController } from "./certification.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Certification, CertificationSchema } from "./entities/certification.entity";

@Module({
  imports: [MongooseModule.forFeature([{ name: Certification.name, schema: CertificationSchema }])],
  controllers: [CertificationController],
  providers: [CertificationService],
  exports: [CertificationService],
})
export class CertificationModule {}
