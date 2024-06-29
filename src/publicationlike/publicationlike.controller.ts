import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { PublicationlikeService } from "./publicationlike.service";
import { CreatePublicationlikeDto } from "./dto/create-publicationlike.dto";
import { UpdatePublicationlikeDto } from "./dto/update-publicationlike.dto";
import { Publicationlike } from "./entities/publicationlike.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("publicationlike")
export class PublicationlikeController {
  constructor(private readonly publicationlikeService: PublicationlikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPublicationlikeDto: CreatePublicationlikeDto): Promise<Publicationlike> {
    return await this.publicationlikeService.create(createPublicationlikeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Publicationlike[]> {
    return await this.publicationlikeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findById(@Param("id") id: string): Promise<Publicationlike> {
    return await this.publicationlikeService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id/publication")
  async findByPubicationId(@Param("id") id: string): Promise<Publicationlike> {
    return await this.publicationlikeService.findOneByPublicationId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Publicationlike> {
    return await this.publicationlikeService.changeStatus(id);
  }
}
