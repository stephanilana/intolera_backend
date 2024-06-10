import { IsString } from "class-validator";

export class CreateCommentDto {
  @IsString()
  id_user: string;
  @IsString()
  id_publication: string;
  @IsString()
  text: string;
}
