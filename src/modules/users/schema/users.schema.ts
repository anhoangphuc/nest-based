import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'users' })
export class Users {
  @Prop({
    type: String,
    index: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
  })
  password: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isActivated: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
export type UsersDocument = Users & Document;
