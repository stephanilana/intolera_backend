import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { CertificationService } from "./certification.service";
import { CreateCertificationDto } from "./dto/create-certification.dto";
import { UpdateCertificationDto } from "./dto/update-certification.dto";
import { Certification } from "./entities/certification.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("certification")
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCertificationDto: CreateCertificationDto): Promise<Certification> {
    return await this.certificationService.create(createCertificationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Certification[]> {
    return await this.certificationService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findById(@Param("id") id: string): Promise<Certification> {
    return await this.certificationService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateCertificationDto: UpdateCertificationDto): Promise<Certification> {
    return await this.certificationService.update(id, updateCertificationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Certification> {
    return await this.certificationService.remove(id);
  }
}
