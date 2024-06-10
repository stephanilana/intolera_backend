import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { FollowerService } from "./follower.service";
import { CreateFollowerDto } from "./dto/create-follower.dto";
import { UpdateFollowerDto } from "./dto/update-follower.dto";
import { Follower } from "./entities/follower.entity";

@Controller("follower")
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Post()
  async create(@Body() createFollowerDto: CreateFollowerDto): Promise<Follower> {
    return await this.followerService.create(createFollowerDto);
  }

  @Get()
  async findAll(): Promise<Follower[]> {
    return await this.followerService.findAll();
  }

  @Get(":userid/user/unaccepted")
  async findAllUnaccepted(@Param("userid") userid: string): Promise<Follower[]> {
    return await this.followerService.findAllUnaccepted(userid);
  }

  @Get(":userid/user/acepted")
  async findAllAcepted(@Param("userid") userid: string): Promise<Follower[]> {
    return await this.followerService.findAllAcepted(userid);
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<Follower> {
    return await this.followerService.findOneById(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateFollowerDto: UpdateFollowerDto): Promise<Follower> {
    return await this.followerService.update(id, updateFollowerDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Follower> {
    return await this.followerService.remove(id);
  }
}
