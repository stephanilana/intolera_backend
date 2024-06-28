import { BadGatewayException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./entities/user.entity";
import { Connection, Model } from "mongoose";
import { hash } from "bcrypt";
import { ReturnUserDto } from "./dto/return-user.dto";
import { JwtService } from "@nestjs/jwt";
import { CertificationService } from "src/certification/certification.service";
import { FollowerService } from "src/follower/follower.service";
import { ProfileService } from "src/profile/profile.service";
import { CreateProfileDto } from "src/profile/dto/create-profile.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: Connection,
    private jwtService: JwtService,
    private certificationService: CertificationService,
    private followerService: FollowerService,
    private profileService: ProfileService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
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
      }).save({ session });
      let profieDto = new CreateProfileDto();
      profieDto.id_user = user._id.toString();
      profieDto.description = "";
      profieDto.profile_picture = "";

      const profile = await this.profileService.create(profieDto);

      await session.commitTransaction();
      session.endSession();

      return user;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({
      deleted_at: "",
    });
  }

  async findAllCertifiedUsers(): Promise<User[]> {
    const validCertifications = await this.certificationService.findAllValidCertifications();
    const certifiedUserIds = validCertifications.map(certification => certification.id_user);

    return this.userModel.find({ _id: { $in: certifiedUserIds } }).exec();
  }

  async findAllFollowedUsers(userId: string): Promise<User[]> {
    const followedUsersRelations = await this.followerService.findAllAcepted(userId);
    const followedUsersIds = followedUsersRelations.map(followedRelations => followedRelations.id_user_follower);

    return this.userModel.find({ _id: { $in: followedUsersIds } }).exec();
  }

  async findByName(name: string): Promise<User[]> {
    return this.userModel
      .find({
        name: new RegExp(name, "i"),
        deleted_at: "",
      })
      .limit(5);
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
