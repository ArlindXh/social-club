import {
    Model, Schema, model
  } from 'mongoose';
  export interface UserLikesInterface {
    liked: string;
    likedBy: string;
  }
  
  interface UserLikesModel extends Model<UserLikesInterface> { }
  
  const schema = new Schema<UserLikesInterface>({
    liked: { type: String, index: true, required: true },
    likedBy: { type: String, index: true, required: true }
  });
  const UserLikes: UserLikesModel = model<UserLikesInterface, UserLikesModel>('user_likes', schema);
  
  export default UserLikes;
  