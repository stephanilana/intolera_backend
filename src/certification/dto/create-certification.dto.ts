import { IsString } from "class-validator";

export class CreateCertificationDto {
  @IsString()
  certification: string;
}
