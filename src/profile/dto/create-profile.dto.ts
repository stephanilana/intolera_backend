import { IsString } from "class-validator";

export class CreateProfileDto {
  @IsString()
  id_user: string;
  @IsString()
  description: string;
  @IsString()
  profile_picture: string;
}
