import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: "Nome não pode ser vazio" })
  @Length(3, 120, { message: "Nome deve conter entre 3 e 120 caracteres" })
  name: string;
  @IsEmail()
  @IsNotEmpty({ message: "Email não pode ser vazio" })
  email: string;
  certificate: string;
  @IsString()
  @IsStrongPassword()
  password: string;
}
