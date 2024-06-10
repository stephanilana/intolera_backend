import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CertificationService } from "./certification.service";
import { CreateCertificationDto } from "./dto/create-certification.dto";
import { UpdateCertificationDto } from "./dto/update-certification.dto";
import { Certification } from "./entities/certification.entity";

@Controller("certification")
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Post()
  async create(@Body() createCertificationDto: CreateCertificationDto): Promise<Certification> {
    return await this.certificationService.create(createCertificationDto);
  }

  @Get()
  async findAll(): Promise<Certification[]> {
    return await this.certificationService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<Certification> {
    return await this.certificationService.findOneById(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateCertificationDto: UpdateCertificationDto): Promise<Certification> {
    return await this.certificationService.update(id, updateCertificationDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Certification> {
    return await this.certificationService.remove(id);
  }
}
