import { IsString } from "class-validator";

export class CreateCertificationDto {
  @IsString()
  id_user: string;
  @IsString()
  certification: string;
}
