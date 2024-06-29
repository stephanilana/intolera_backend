import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment } from "./entities/comment.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return await this.commentService.create(createCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Comment[]> {
    return await this.commentService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":publicationId/publication")
  async findByPublicationId(@Param("publicationId") publicationId: string): Promise<Comment[]> {
    return await this.commentService.findByPiblicationId(publicationId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findById(@Param("id") id: string): Promise<Comment> {
    return await this.commentService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return await this.commentService.update(id, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Comment> {
    return await this.commentService.remove(id);
  }
}
