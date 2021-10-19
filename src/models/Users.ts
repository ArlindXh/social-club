import {
  Model, Schema, model
} from 'mongoose';
export interface UserInterface {
  name: string;
  email: string;
  password: string;
}

interface UserModel extends Model<UserInterface> { }

const schema = new Schema<UserInterface>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
const User: UserModel = model<UserInterface, UserModel>('user', schema);

export default User;
