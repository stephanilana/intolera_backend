import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { PublicationlikeService } from "./publicationlike.service";
import { CreatePublicationlikeDto } from "./dto/create-publicationlike.dto";
import { UpdatePublicationlikeDto } from "./dto/update-publicationlike.dto";
import { Publicationlike } from "./entities/publicationlike.entity";

@Controller("publicationlike")
export class PublicationlikeController {
  constructor(private readonly publicationlikeService: PublicationlikeService) {}

  @Post()
  async create(@Body() createPublicationlikeDto: CreatePublicationlikeDto): Promise<Publicationlike> {
    return await this.publicationlikeService.create(createPublicationlikeDto);
  }

  @Get()
  async findAll(): Promise<Publicationlike[]> {
    return await this.publicationlikeService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<Publicationlike> {
    return await this.publicationlikeService.findOneById(id);
  }
  @Get(":id/publication")
  async findByPubicationId(@Param("id") id: string): Promise<Publicationlike> {
    return await this.publicationlikeService.findOneByPublicationId(id);
  }

  @Patch(":id/:like")
  async update(@Param("id") id: string, @Param("like") like: string, @Body() updatePublicationlikeDto: UpdatePublicationlikeDto): Promise<Publicationlike> {
    return await this.publicationlikeService.update(id, updatePublicationlikeDto, like);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Publicationlike> {
    return await this.publicationlikeService.remove(id);
  }
}
