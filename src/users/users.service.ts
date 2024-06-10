import { BadGatewayException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./entities/user.entity";
import { Model } from "mongoose";
import { hash } from "bcrypt";
import { ReturnUserDto } from "./dto/return-user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtService: JwtService) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const userEmail = await this.findUserByEmail(createUserDto.email).catch(() => undefined);
    if (userEmail) {
      throw new BadGatewayException("Email já registrado no sistema");
    }
    const saltOrRounds = 10;
    const passwordHashed = await hash(createUserDto.password, saltOrRounds);
    const user = await new this.userModel({
      ...createUserDto,
      password: passwordHashed,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      deleted_at: "",
    }).save();
    return user;
  }
  async findAll(): Promise<User[]> {
    return this.userModel.find({
      deleted_at: "",
    });
  }

  async findByName(name: string): Promise<User[]> {
    return this.userModel.find({
      name: name,
      deleted_at: "",
    });
  }
  async findUserByToken(token: string): Promise<ReturnUserDto> {
    try {
      const decodedToken = this.jwtService.decode(token);
      return await this.findOneById(decodedToken["id"]);
    } catch (error) {
      return null;
    }
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user || user.deleted_at != "") {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      email: email,
    });
    if (!user) {
      throw new NotFoundException("Email not found");
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOneById(id);
    return this.userModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateUserDto,
        updated_at: new Date().toString(),
      },
      {
        new: true,
      },
    );
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOneById(id);

    user.updated_at = new Date().toString();
    return this.userModel.findByIdAndUpdate(
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
