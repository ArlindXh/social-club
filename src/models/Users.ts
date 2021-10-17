import {
  Model, Schema, model
} from 'mongoose';
export interface UserInterface {
  name: string;
  email: string;
  password: string;
  likes: Number
}

interface UserModel extends Model<UserInterface> { }

const schema = new Schema<UserInterface>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  likes: { type: Number }
});
const User: UserModel = model<UserInterface, UserModel>('User', schema);

export default User;
