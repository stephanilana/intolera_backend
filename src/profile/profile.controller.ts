import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { Profile } from "./entities/profile.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    return await this.profileService.create(createProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Profile[]> {
    return await this.profileService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findById(@Param("id") id: string): Promise<Profile> {
    return await this.profileService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":userId/user")
  async findByUserId(@Param("userId") userId: string): Promise<Profile> {
    return await this.profileService.findOneByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
    return await this.profileService.update(id, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Profile> {
    return await this.profileService.remove(id);
  }
}
