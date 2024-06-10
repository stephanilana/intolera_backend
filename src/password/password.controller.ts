import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { PasswordService } from "./password.service";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { Password } from "./entities/password.entity";

@Controller("password")
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  // @Post()
  // async create(@Body() createPasswordDto: CreatePasswordDto): Promise<Password> {
  //   return await this.passwordService.create(createPasswordDto);
  // }

  @Get()
  async findAll(): Promise<Password[]> {
    return await this.passwordService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<Password> {
    return await this.passwordService.findOneById(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updatePasswordDto: UpdatePasswordDto): Promise<Password> {
    return await this.passwordService.update(id, updatePasswordDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string): Promise<Password> {
    return await this.passwordService.remove(id);
  }
}
