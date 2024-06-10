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

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updatePublicationlikeDto: UpdatePublicationlikeDto): Promise<Publicationlike> {
    return await this.publicationlikeService.update(id, updatePublicationlikeDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Publicationlike> {
    return await this.publicationlikeService.remove(id);
  }
}
