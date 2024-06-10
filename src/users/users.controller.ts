import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { ReturnUserDto } from "./dto/return-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(":name/by-name")
  async findByName(@Param("name") name: string): Promise<User[]> {
    return await this.userService.findByName(name);
  }

  @Get(":token/by-token")
  async findByToken(@Param("token") token: string): Promise<ReturnUserDto> {
    return await this.userService.findUserByToken(token);
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<User> {
    return await this.userService.findOneById(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<User> {
    return await this.userService.remove(id);
  }
}
