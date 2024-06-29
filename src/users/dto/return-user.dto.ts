export class ReturnUserDto {
  _id: string;
  email: string;
  name: string;
  certificate: string;
  constructor(id: string, email: string, name: string, certificate: string) {
    (this._id = id), (this.email = email), (this.name = name);
    this.certificate = certificate;
  }
}
