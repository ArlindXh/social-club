import { RequestHandler, Request, Response } from 'express';
import User, { UserInterface } from '../../models/Users';
import UserLikes from '../../models/UserLikes';
import logger from '../../logger';

const findAll: RequestHandler = async (req: Request, res: Response) => {
    try {
        const users: Array<UserInterface> = await User.find({}, 'name');
        const detailedUsers = await Promise.all(users.map(async (user: any) => {
            let userLikes: number = await UserLikes.countDocuments({ liked: user._id })
            return { name: user.name, likes: userLikes }

        }))
        res.send({
            message: "User Information Data",
            user: detailedUsers.sort((a, b) => b.likes - a.likes)
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
};

export default findAll;