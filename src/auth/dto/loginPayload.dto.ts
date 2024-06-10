export class LoginPayloadDto {
  id: string;
  email: string;
  constructor(id: string, email: string) {
    this.id = id;
    this.email = email;
  }
}
