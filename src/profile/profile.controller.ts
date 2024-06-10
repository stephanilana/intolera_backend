import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { Profile } from "./entities/profile.entity";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    return await this.profileService.create(createProfileDto);
  }

  @Get()
  async findAll(): Promise<Profile[]> {
    return await this.profileService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<Profile> {
    return await this.profileService.findOneById(id);
  }

  @Get(":userId/user")
  async findByUserId(@Param("userId") userId: string): Promise<Profile> {
    return await this.profileService.findOneByUserId(userId);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
    return await this.profileService.update(id, updateProfileDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Profile> {
    return await this.profileService.remove(id);
  }
}
