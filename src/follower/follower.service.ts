import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateFollowerDto } from "./dto/create-follower.dto";
import { UpdateFollowerDto } from "./dto/update-follower.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Follower, FollowerDocument } from "./entities/follower.entity";
import { Model } from "mongoose";

@Injectable()
export class FollowerService {
  constructor(@InjectModel(Follower.name) private followerModel: Model<FollowerDocument>) {}
  async create(createFollowerDto: CreateFollowerDto): Promise<Follower> {
    return new this.followerModel({
      ...createFollowerDto,
      acepted: false,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      deleted_at: "",
    }).save();
  }

  async findAll(): Promise<Follower[]> {
    return this.followerModel.find({
      deleted_at: "",
    });
  }

  async findAllAcepted(userid: string): Promise<Follower[]> {
    return this.followerModel.find({
      id_user_followed: userid,
      acepted: true,
      deleted_at: "",
    });
  }

  async findAllUnaccepted(userid: string): Promise<Follower[]> {
    return this.followerModel.find({
      id_user_followed: userid,
      acepted: false,
      deleted_at: "",
    });
  }

  async findOneById(id: string): Promise<Follower> {
    const follower = await this.followerModel.findById(id);
    if (!follower || follower.deleted_at != "") {
      throw new NotFoundException("Follower not found");
    }
    return follower;
  }

  async update(id: string, updateFollowerDto: UpdateFollowerDto): Promise<Follower> {
    await this.findOneById(id);
    return this.followerModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateFollowerDto,
        updated_at: new Date().toString(),
      },
      {
        new: true,
      },
    );
  }

  async remove(id: string): Promise<Follower> {
    const follower = await this.findOneById(id);

    follower.updated_at = new Date().toString();
    return this.followerModel.findByIdAndUpdate(
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
