import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Password, PasswordDocument } from "./entities/password.entity";
import { Model } from "mongoose";

@Injectable()
export class PasswordService {
  constructor(@InjectModel(Password.name) private passwordModel: Model<PasswordDocument>) {}
  async create(idUser, password): Promise<Password> {
    return new this.passwordModel({
      id_user: idUser,
      password: password,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      deleted_at: "",
    }).save();
  }
  async findAll(): Promise<Password[]> {
    return this.passwordModel.find({
      deleted_at: "",
    });
  }

  async findOneById(id: string): Promise<Password> {
    const password = await this.passwordModel.findById(id);
    if (!password || password.deleted_at != "") {
      throw new NotFoundException("Password not found");
    }
    return password;
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto): Promise<Password> {
    await this.findOneById(id);
    return this.passwordModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updatePasswordDto,
        updated_at: new Date().toString(),
      },
      {
        new: true,
      },
    );
  }

  async remove(id: string): Promise<Password> {
    const password = await this.findOneById(id);

    password.updated_at = new Date().toString();
    return this.passwordModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        deleted_at: new Date().toString(),
        updated_at: new Date().toString(),
      },
      {
        new: true,
      },
    );
  }
}
