import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UsersRole } from '../../../shares/enums/users-role.enum';

@Schema({ timestamps: true, collection: 'users', toObject: { virtuals: true } })
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
    enum: UsersRole,
    default: UsersRole.USER_INACTIVATED,
  })
  role: UsersRole;

  @Prop({
    type: String,
  })
  ethAddress: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
UsersSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
export type UsersDocument = Users & Document;
