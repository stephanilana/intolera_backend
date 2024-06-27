import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument } from "./entities/comment.entity";

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    return new this.commentModel({
      ...createCommentDto,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      deleted_at: "",
    }).save();
  }
  async findAll(): Promise<Comment[]> {
    return this.commentModel.find({
      deleted_at: "",
    });
  }

  async findByPiblicationId(id: string): Promise<Comment[]> {
    return this.commentModel.aggregate([
      {
        $match: {
          id_publication: id,
          deleted_at: ""
        }
      },
      {
        $lookup: {
          from: 'users',
          let: { id_user: "$id_user" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$id_user" }]
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
        $unwind: {
          path: "$user_details",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1, // Inclui o ID do comentário
          id_publication: 1,
          id_user: 1,
          name: "$user_details.name",
          text: 1,
          created_at: 1,
          updated_at: 1,
          deleted_at: 1
        }
      }
    ]).sort({ created_at: -1 }).exec();
  }

  async findOneById(id: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id);
    if (!comment || comment.deleted_at != "") {
      throw new NotFoundException("Comment not found");
    }
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    await this.findOneById(id);
    return this.commentModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateCommentDto,
        updated_at: new Date().toString(),
      },
      {
        new: true,
      },
    );
  }

  async remove(id: string): Promise<Comment> {
    const comment = await this.findOneById(id);

    comment.updated_at = new Date().toString();
    return this.commentModel.findByIdAndUpdate(
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
