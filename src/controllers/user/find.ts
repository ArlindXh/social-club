import { RequestHandler } from 'express';
import User, { UserInterface } from '../../models/Users';
import UserLikes, { UserLikesInterface } from '../../models/UserLikes';
import logger from '../../logger';

const find: RequestHandler = async (req: any, res) => {
    try {
        const {id: userId } = req.params
        
        const user: UserInterface = await User.findById(userId, "name -_id");
        const userLikes: number = await UserLikes.countDocuments({liked: userId})
        const userData: Object = {
            name: user.name,
            likes: userLikes
        }
        res.send({
            message: "User Information Data",
            user: userData
        });

    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
};

export default find;