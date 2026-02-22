import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const emailVerificationToken = uuidv4();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationExpires,
      isEmailVerified: false,
    });
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    return !!user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async addRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $push: { refreshTokens: refreshToken },
      })
      .exec();
  }

  async verifyRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      return false;
    }
    return user.refreshTokens.includes(refreshToken);
  }

  async replaceRefreshToken(
    userId: string,
    oldToken: string,
    newToken: string,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $pull: { refreshTokens: oldToken },
      })
      .exec();
    await this.userModel
      .findByIdAndUpdate(userId, {
        $push: { refreshTokens: newToken },
      })
      .exec();
  }

  async removeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $pull: { refreshTokens: refreshToken },
      })
      .exec();
  }

  async findByVerificationToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ emailVerificationToken: token }).exec();
  }

  async verifyEmail(token: string): Promise<boolean> {
    const user = await this.findByVerificationToken(token);

    if (!user) {
      return false;
    }

    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires < new Date()
    ) {
      return false; // Token expired
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    return true;
  }

  async updateVerificationToken(email: string): Promise<UserDocument> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const emailVerificationToken = uuidv4();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();

    return user;
  }

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async findByGithubId(githubId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ githubId }).exec();
  }

  async createOAuthUser(userData: {
    email: string;
    provider: string;
    googleId?: string;
    githubId?: string;
  }): Promise<UserDocument> {
    const user = new this.userModel({
      ...userData,
      isEmailVerified: true, // OAuth emails are pre-verified
    });
    return user.save();
  }
}
