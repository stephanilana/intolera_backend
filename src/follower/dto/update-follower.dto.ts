import { IsBoolean } from "class-validator";

export class UpdateFollowerDto {
  @IsBoolean()
  acepted: boolean;
}
