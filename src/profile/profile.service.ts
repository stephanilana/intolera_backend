import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Profile, ProfileDocument } from "./entities/profile.entity";
import { Model } from "mongoose";
import { VisitProfileDto } from "./dto/visit-profile.dto";

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

  async visitUser(visitProfileDto: VisitProfileDto): Promise<any> {
    const visitedUserProfile = await this.profileModel
      .aggregate([
        {
          $match: {
            id_user: visitProfileDto.id_visited_user,
            deleted_at: "",
          },
        },
        {
          $sort: { created_at: -1 },
        },
        {
          $lookup: {
            from: "users",
            let: { author_id: { $toObjectId: "$id_user" } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$author_id"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  email: 1,
                  certificate: 1,
                },
              },
            ],
            as: "user",
          },
        },
        {
          $lookup: {
            from: "followers",
            let: { followed_id: "$id_user", current_user_id: visitProfileDto.id_user },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$id_user_followed", "$$followed_id"] }, { $eq: ["$id_user_follower", "$$current_user_id"] }],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  id_user_follower: 1,
                  id_user_followed: 1,
                  acepted: 1,
                },
              },
            ],
            as: "follower_info",
          },
        },
        {
          $addFields: {
            is_following: {
              $cond: {
                if: { $gt: [{ $size: "$follower_info" }, 0] },
                then: true,
                else: false,
              },
            },
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            id_user: 1,
            description: 1,
            profile_picture: 1,
            user_email: "$user.email",
            user_name: "$user.name",
            is_following: 1,
            created_at: 1,
            updated_at: 1,
            deleted_at: 1,
          },
        },
      ])
      .exec();

    return visitedUserProfile[0];
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
    await this.findOneByUserId(id);
    await this.profileModel.updateOne(
      {
        id_user: id,
      },
      {
        $set: updateProfileDto,
        updated_at: new Date().toString(),
      },
      {
        new: true,
      },
    );
    return await this.findOneByUserId(id);
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
