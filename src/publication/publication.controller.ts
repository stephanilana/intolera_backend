import { Controller, Get, Body, Patch, Param, Delete, Post, UseGuards } from "@nestjs/common";
import { PublicationService } from "./publication.service";
import { CreatePublicationDto } from "./dto/create-publication.dto";
import { UpdatePublicationDto } from "./dto/update-publication.dto";
import { Publication } from "./entities/publication.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

// @UseGuards(JwtAuthGuard)
@Controller("publication")
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  async create(@Body() createPublicationDto: CreatePublicationDto): Promise<Publication> {
    return await this.publicationService.create(createPublicationDto);
  }

  @Get()
  async findAll(): Promise<Publication[]> {
    return await this.publicationService.findAll();
  }

  @Get(":userId/user-id")
  async findByUserId(@Param("userId") userId: string): Promise<Publication[]> {
    return await this.publicationService.findByUserId(userId);
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<Publication> {
    return await this.publicationService.findOneById(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updatePublicationDto: UpdatePublicationDto): Promise<Publication> {
    return await this.publicationService.update(id, updatePublicationDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Publication> {
    return await this.publicationService.remove(id);
  }
}
