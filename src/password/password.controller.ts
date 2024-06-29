import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { PasswordService } from "./password.service";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { Password } from "./entities/password.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("password")
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  // @Post()
  // async create(@Body() createPasswordDto: CreatePasswordDto): Promise<Password> {
  //   return await this.passwordService.create(createPasswordDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Password[]> {
    return await this.passwordService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findById(@Param("id") id: string): Promise<Password> {
    return await this.passwordService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updatePasswordDto: UpdatePasswordDto): Promise<Password> {
    return await this.passwordService.update(id, updatePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Password> {
    return await this.passwordService.remove(id);
  }
}
