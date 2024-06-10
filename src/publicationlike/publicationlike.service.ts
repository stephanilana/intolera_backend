import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePublicationlikeDto } from "./dto/create-publicationlike.dto";
import { UpdatePublicationlikeDto } from "./dto/update-publicationlike.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Publicationlike, PublicationlikeDocument } from "./entities/publicationlike.entity";
import { Model } from "mongoose";

@Injectable()
export class PublicationlikeService {
  constructor(@InjectModel(Publicationlike.name) private publicationLikeModel: Model<PublicationlikeDocument>) {}
  async create(createPublicationlikeDto: CreatePublicationlikeDto): Promise<Publicationlike> {
    return new this.publicationLikeModel({
      ...createPublicationlikeDto,
      amount: +1, //TODO: validar como vai ser gravado
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      deleted_at: "",
    }).save();
  }
  async findAll(): Promise<Publicationlike[]> {
    return this.publicationLikeModel.find({
      deleted_at: "",
    });
  }

  async findOneById(id: string): Promise<Publicationlike> {
    const publicationLike = await this.publicationLikeModel.findById(id);
    if (!publicationLike || publicationLike.deleted_at != "") {
      throw new NotFoundException("Publication like not found");
    }
    return publicationLike;
  }

  async update(id: string, updatePublicationlikeDto: UpdatePublicationlikeDto): Promise<Publicationlike> {
    await this.findOneById(id);
    return this.publicationLikeModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updatePublicationlikeDto,
        updated_at: new Date().toString(),
      },
      {
        new: true,
      },
    );
  }

  async remove(id: string): Promise<Publicationlike> {
    const publicationLike = await this.findOneById(id);

    publicationLike.updated_at = new Date().toString();
    return this.publicationLikeModel.findByIdAndUpdate(
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
