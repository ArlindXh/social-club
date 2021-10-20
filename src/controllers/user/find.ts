import { RequestHandler, Request, Response } from 'express';
import User, { UserInterface } from '../../models/Users';
import UserLikes from '../../models/UserLikes';
import logger from '../../logger';

const find: RequestHandler = async (req: Request, res: Response) => {
    try {
        const {id: userId } = req.params
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send({ message: "Unsupported id in path" });
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