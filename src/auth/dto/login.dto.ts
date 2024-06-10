import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: "Email não pode ser vazio" })
  email: string;
  @IsString()
  @IsStrongPassword()
  password: string;
}
