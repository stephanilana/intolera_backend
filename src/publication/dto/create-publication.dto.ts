import { IsBoolean, IsString } from "class-validator";

export class CreatePublicationDto {
  @IsString()
  id_user: string;
  @IsString()
  picture_publication: string;
  @IsString()
  text: string;
  @IsBoolean()
  certificated_user: boolean;
}
