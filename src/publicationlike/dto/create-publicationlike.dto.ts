import { IsString } from "class-validator";

export class CreatePublicationlikeDto {
  @IsString()
  id_publication: string;

  @IsString()
  id_user: string;
}
