import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { LoginDto } from "./dto/login.dto";
import { ReturnLoginDto } from "./dto/returnLogin.dto";
import { ReturnUserDto } from "src/users/dto/return-user.dto";
import { compare } from "bcrypt";
import { LoginPayloadDto } from "./dto/loginPayload.dto";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private jwtService: JwtService) {}

  async signIn(loginDto: LoginDto): Promise<ReturnLoginDto> {
    const user = await this.usersService.findUserByEmail(loginDto.email).catch(() => undefined);
    const isMatch = await compare(loginDto.password, user?.password || "");
    if (!user || !isMatch) {
      throw new NotFoundException("Email ou senha inválidos");
    }
    const userReturn = new ReturnUserDto(user._id.toString(), user.email, user.name, user.certificate);

    return {
      accessToken: this.jwtService.sign({ ...new LoginPayloadDto(user._id, user.email) }),
      user: userReturn,
    };
  }
}
