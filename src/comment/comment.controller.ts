import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment } from "./entities/comment.entity";

@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return await this.commentService.create(createCommentDto);
  }

  @Get()
  async findAll(): Promise<Comment[]> {
    return await this.commentService.findAll();
  }

  @Get(":publicationId/publication")
  async findByPublicationId(@Param("publicationId") publicationId: string): Promise<Comment[]> {
    return await this.commentService.findByPiblicationId(publicationId);
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<Comment> {
    return await this.commentService.findOneById(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return await this.commentService.update(id, updateCommentDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Comment> {
    return await this.commentService.remove(id);
  }
}
