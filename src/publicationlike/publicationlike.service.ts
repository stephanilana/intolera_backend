import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePublicationlikeDto } from "./dto/create-publicationlike.dto";
import { UpdatePublicationlikeDto } from "./dto/update-publicationlike.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Publicationlike, PublicationlikeDocument } from "./entities/publicationlike.entity";
import { Model } from "mongoose";
import { UsersService } from "src/users/users.service";

@Injectable()
export class PublicationlikeService {
  constructor(
    @InjectModel(Publicationlike.name) private publicationLikeModel: Model<PublicationlikeDocument>,
    private readonly userService: UsersService
    ) {}
  
    async create(createPublicationlikeDto: CreatePublicationlikeDto): Promise<Publicationlike> {
    
      const alreadyLiked = await this.findPublicationByIdAndUserId(createPublicationlikeDto);

      if (alreadyLiked) {
        await this.changeStatus(createPublicationlikeDto.id_publication);

        return;
      } else {
        return await new this.publicationLikeModel({
          ...createPublicationlikeDto,
          created_at: new Date().toString(),
          updated_at: new Date().toString(),
          deleted_at: "",
        }).save();
      }
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

  async findOneByPublicationId(id: string): Promise<Publicationlike> {
    const publicationLike = await this.publicationLikeModel.findOne({
      id_publication: id
    });

    return publicationLike;
  }

  async findPublicationByIdAndUserId(createPublicationlikeDto: CreatePublicationlikeDto): Promise<Publicationlike> {
    return await this.publicationLikeModel.findOne({
      id_publication: createPublicationlikeDto.id_publication,
      id_user: createPublicationlikeDto.id_user
    });
  }

  async changeStatus(publicationId: string): Promise<Publicationlike> {
    const publicationLike = await this.findOneByPublicationId(publicationId);

    if (publicationLike.deleted_at != '') {
      return this.publicationLikeModel.findByIdAndUpdate(
        publicationLike['_id'],
        {
          deleted_at: '',
          updated_at: new Date(),
        },
        {
          new: true,
        }
      );
    }

    return this.publicationLikeModel.findByIdAndUpdate(
      publicationLike['_id'],
      {
        deleted_at: new Date(),
        updated_at: new Date(),
      },
      {
        new: true,
      }
    );
  }
}
