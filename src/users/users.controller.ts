import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { ReturnUserDto } from "./dto/return-user.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":name/by-name")
  async findByName(@Param("name") name: string): Promise<User[]> {
    return await this.userService.findByName(name);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":token/by-token")
  async findByToken(@Param("token") token: string): Promise<ReturnUserDto> {
    return await this.userService.findUserByToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findById(@Param("id") id: string): Promise<User> {
    return await this.userService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<User> {
    return await this.userService.remove(id);
  }
}
