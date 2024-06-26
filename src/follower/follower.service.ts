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
    const followers = await this.followerModel.aggregate([
      {
        $match: {
          id_user_followed: userid,
          acepted: false,
          deleted_at: ""
        }
      },
      {
        $lookup: {
          from: 'users',
          let: { follower_id: "$id_user_follower" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$follower_id" }]
                }
              }
            },
            {
              $project: {
                _id: 0,
                userId: "$_id",
                name: "$name"
              }
            }
          ],
          as: 'user_details'
        }
      },
      {
        $lookup: {
          from: 'profiles',
          let: { follower_id: "$id_user_follower" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userId", { $toObjectId: "$$follower_id" }]
                }
              }
            },
            {
              $project: {
                _id: 0,
                profile_picture: "$profile_picture"
              }
            }
          ],
          as: 'profile_details'
        }
      },
      {
        $lookup: {
          from: "certifications",
          let: { follower_id:  "$id_user_follower"},
          pipeline: [
            {
              $addFields: {
                user_id:  "$id_user"
              }
            },
            {
              $match: {
                $expr: {
                  $eq: ["$user_id", "$$follower_id"]
                }
              }
            }
          ],
          as: "certifications"
        }
      },
      {
        $unwind: {
          path: "$user_details",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$profile_details",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$certifications",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          userId: "$user_details.userId",
          name: "$user_details.name",
          profile_picture: { $ifNull: ["$profile_details.profile_picture", "blank_profile_image"] },
          certificated: { $ifNull: ["$certifications.valid_certification", false] }
        }
      }
    ]).exec();
  
    return followers;
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
