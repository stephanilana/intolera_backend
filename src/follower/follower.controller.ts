import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { FollowerService } from "./follower.service";
import { CreateFollowerDto } from "./dto/create-follower.dto";
import { UpdateFollowerDto } from "./dto/update-follower.dto";
import { Follower } from "./entities/follower.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("follower")
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createFollowerDto: CreateFollowerDto): Promise<Follower> {
    return await this.followerService.create(createFollowerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Follower[]> {
    return await this.followerService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":userid/user/unaccepted")
  async findAllUnaccepted(@Param("userid") userid: string): Promise<Follower[]> {
    return await this.followerService.findAllUnaccepted(userid);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":userid/user/acepted")
  async findAllAcepted(@Param("userid") userid: string): Promise<Follower[]> {
    return await this.followerService.findAllAcepted(userid);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findById(@Param("id") id: string): Promise<Follower> {
    return await this.followerService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateFollowerDto: UpdateFollowerDto): Promise<Follower> {
    return await this.followerService.update(id, updateFollowerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Follower> {
    return await this.followerService.remove(id);
  }
}
