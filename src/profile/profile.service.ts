import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Profile, ProfileDocument } from "./entities/profile.entity";
import { Model } from "mongoose";

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<ProfileDocument>) {}
  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    return new this.profileModel({
      ...createProfileDto,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      deleted_at: "",
    }).save();
  }
  async findAll(): Promise<Profile[]> {
    return this.profileModel.find({
      deleted_at: "",
    });
  }

  async findOneByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({
      id_user: userId,
    });
    if (!profile || profile.deleted_at != "") {
      throw new NotFoundException("Profile not found");
    }
    return profile;
  }

  async findOneById(id: string): Promise<Profile> {
    const profile = await this.profileModel.findById(id);
    if (!profile || profile.deleted_at != "") {
      throw new NotFoundException("Profile not found");
    }
    return profile;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    await this.findOneById(id);
    return this.profileModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateProfileDto,
        updated_at: new Date().toString(),
      },
      {
        new: true,
      },
    );
  }

  async remove(id: string): Promise<Profile> {
    const profile = await this.findOneById(id);

    profile.updated_at = new Date().toString();
    return this.profileModel.findByIdAndUpdate(
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
