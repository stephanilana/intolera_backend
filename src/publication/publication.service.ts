import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePublicationDto } from "./dto/create-publication.dto";
import { UpdatePublicationDto } from "./dto/update-publication.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Publication, PublicationDocument } from "./entities/publication.entity";
import { UsersService } from "src/users/users.service";
import { Model } from "mongoose";

@Injectable()
export class PublicationService {
  constructor(@InjectModel(Publication.name) private publicationModel: Model<PublicationDocument>, private usersService: UsersService) {}
  async create(createPublicationDto: CreatePublicationDto): Promise<Publication> {
    return new this.publicationModel({
      ...createPublicationDto,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      deleted_at: "",
    }).save();
  }

  async findTimeline(userId: string): Promise<Publication[]> {
    const certifiedUsers = await this.usersService.findAllCertifiedUsers();
    const followedUsers = await this.usersService.findAllFollowedUsers(userId);

    const timelineUsersIds = certifiedUsers.concat(followedUsers);

    const parsedIds = timelineUsersIds.map(user => user["_id"].toString());

    const publications = await this.publicationModel.aggregate([
      {
        $match: {
          id_user: { $in: parsedIds },
          deleted_at: "",
        },
      },
      {
        $sort: { created_at: -1 },
      },
      {
        $lookup: {
          from: "comments",
          let: { publication_id: "$_id" },
          pipeline: [
            {
              $addFields: {
                id_publication: {
                  $toObjectId: "$id_publication"
                }
              }
            },
            {
              $match: {
                $expr: {
                  $eq: ["$id_publication", "$$publication_id"]
                }
              }
            }
          ],
          as: "comments"
        }
      },
      {
        $lookup: {
          from: "publicationlikes",
          let: { publication_id: "$_id" },
          pipeline: [
            {
              $addFields: {
                id_publication_likes: {
                  $toObjectId: "$id_publication"
                }
              }
            },
            {
              $match: {
                $expr: {
                  $eq: [
                    "$id_publication_likes",
                    "$$publication_id"
                  ]
                }
              }
            }
          ],
          as: "likes"
        }
      },
      {
        $lookup: {
          from: "users",
          let: { author_id: {
            $toObjectId: "$id_user"
          } },
          pipeline: [
            {
              $addFields: {
                user_id:  "$_id"
              }
            },
            {
              $match: {
                $expr: {
                  $eq: ["$user_id", "$$author_id"]
                }
              }
            }
          ],
          as: "author"
        },
      },
      {
        $lookup: {
          from: "certifications",
          let: { author_id:  "$id_user"},
          pipeline: [
            {
              $addFields: {
                user_id:  "$id_user"
              }
            },
            {
              $match: {
                $expr: {
                  $eq: ["$user_id", "$$author_id"]
                }
              }
            }
          ],
          as: "certifications"
        }
      },
      {
        $lookup: {
          from: "profiles",
          let: { author_id:  "$id_user"},
          pipeline: [
            {
              $addFields: {
                user_id:  "$id_user"
              }
            },
            {
              $match: {
                $expr: {
                  $eq: ["$user_id", "$$author_id"]
                }
              }
            }
          ],
          as: "profile_info"
        }
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $unwind: {
          path: "$certifications",
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $unwind: {
          path: "$profile_info",
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $addFields: {
          first_comment: {
            $ifNull: [{ $arrayElemAt: ['$comments.text', 0] }, " "]
          }
        },
      },
      {
        $addFields: {
          likes: { $size: "$likes" }
        },
      },
      {
        $project: {
          _id: 1,
          id_user: 1,
          created_at: 1,
          updated_at: 1,
          text: 1,
          picture_publication: 1,
          author_name: '$author.name',
          author_profile_picture: { $ifNull: ['$profile_info.profile_picture', 'blank_profile_image']},
          likes: 1,
          name_user_comment: " ",
          first_comment: 1,
          certified_publication: '$certifications.valid_certification',
          certificated_user: 1,
        },
      }
    ]).exec();

    return publications;
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
