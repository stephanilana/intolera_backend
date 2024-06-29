import { IsString } from "class-validator";

export class VisitProfileDto {
  @IsString()
  id_user: string;

  @IsString()
  id_visited_user: string;
}
