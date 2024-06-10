export class ReturnUserDto {
  id: string;
  email: string;
  name: string;
  certificate: string;
  constructor(id: string, email: string, name: string, certificate: string) {
    (this.id = id), (this.email = email), (this.name = name);
    this.certificate = certificate;
  }
}
