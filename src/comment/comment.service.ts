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
    return this.commentModel
      .find({
        id_publication: id,
        deleted_at: "",
      })
      .sort({ created_at: -1 })
      .exec();
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
