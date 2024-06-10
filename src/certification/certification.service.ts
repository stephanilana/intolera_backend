import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCertificationDto } from "./dto/create-certification.dto";
import { UpdateCertificationDto } from "./dto/update-certification.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Certification, CertificationDocument } from "./entities/certification.entity";
import { Model } from "mongoose";

@Injectable()
export class CertificationService {
  constructor(@InjectModel(Certification.name) private certificationModel: Model<CertificationDocument>) {}
  async create(createCertificationDto: CreateCertificationDto): Promise<Certification> {
    return new this.certificationModel({
      ...createCertificationDto,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      deleted_at: "",
    }).save();
  }
  async findAll(): Promise<Certification[]> {
    return this.certificationModel.find({
      deleted_at: "",
    });
  }

  async findOneById(id: string): Promise<Certification> {
    const certification = await this.certificationModel.findById(id);
    if (!certification || certification.deleted_at != "") {
      throw new NotFoundException("Certification not found");
    }
    return certification;
  }

  async update(id: string, updateCertificationDto: UpdateCertificationDto): Promise<Certification> {
    await this.findOneById(id);
    return this.certificationModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateCertificationDto,
        updated_at: new Date().toString(),
      },
      {
        new: true,
      },
    );
  }

  async remove(id: string): Promise<Certification> {
    const certification = await this.findOneById(id);

    certification.updated_at = new Date().toString();
    return this.certificationModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        deleted_at: new Date().toString(),
        updated_at: new Date().toString(),
      },
      {
        new: true,
      },
    );
  }
}
