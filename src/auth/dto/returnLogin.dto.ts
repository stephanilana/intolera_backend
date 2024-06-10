import { ReturnUserDto } from "src/users/dto/return-user.dto";

export interface ReturnLoginDto {
  user: ReturnUserDto;
  accessToken: string;
}
