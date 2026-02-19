import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ type: [String], default: [] })
  refreshTokens: string[];

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ type: String, default: null })
  emailVerificationToken: string | null;

  @Prop({ type: Date, default: null })
  emailVerificationExpires: Date | null;

  @Prop({ type: String, default: null })
  googleId: string | null;

  @Prop({ type: String, default: null })
  githubId: string | null;

  @Prop({ type: String, enum: ['local', 'google', 'github'], default: 'local' })
  provider: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
