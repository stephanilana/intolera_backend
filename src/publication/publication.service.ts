import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePublicationDto } from "./dto/create-publication.dto";
import { UpdatePublicationDto } from "./dto/update-publication.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Publication, PublicationDocument } from "./entities/publication.entity";
import { Model } from "mongoose";

@Injectable()
export class PublicationService {
  constructor(@InjectModel(Publication.name) private publicationModel: Model<PublicationDocument>) {}
  async create(createPublicationDto: CreatePublicationDto): Promise<Publication> {
    return new this.publicationModel({
      ...createPublicationDto,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      deleted_at: "",
    }).save();
  }

  async findAll(): Promise<Publication[]> {
    return this.publicationModel
      .find({
        deleted_at: "",
      })
      .sort({ created_at: -1 })
      .exec();
  }

  async findByUserId(userid: string): Promise<Publication[]> {
    return await this.publicationModel
      .find({
        id_user: userid,
        deleted_at: "",
      })
      .sort({ created_at: -1 })
      .exec();
  }

  async findOneById(id: string): Promise<Publication> {
    const publication = await this.publicationModel.findById(id);
    if (!publication || publication.deleted_at != "") {
      throw new NotFoundException("Publication not found");
    }
    return publication;
  }

  async update(id: string, updatePublicationDto: UpdatePublicationDto): Promise<Publication> {
    await this.findOneById(id);
    return this.publicationModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updatePublicationDto,
        updated_at: new Date().toString(),
      },
      {
        new: true,
      },
    );
  }

  async remove(id: string): Promise<Publication> {
    const publication = await this.findOneById(id);

    publication.updated_at = new Date().toString();
    return this.publicationModel.findByIdAndUpdate(
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
