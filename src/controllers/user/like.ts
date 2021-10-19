import { RequestHandler } from 'express';
import UserLikes, { UserLikesInterface } from '../../models/UserLikes';
import User, { UserInterface } from '../../models/Users';
import { verifyAndDecode } from "../../util/jwt";
import { JwtPayload } from "jsonwebtoken"
import logger from '../../logger';

const like: RequestHandler = async (req: any, res) => {
    try {
        const verifiedTokenObj: JwtPayload = verifyAndDecode(req.header("Authorization"));
        const { id: userIdLiked } = req.params

        const userData: UserInterface = await User.findById(userIdLiked, "name");
        const validateLike = await UserLikes.findOne({ likedBy: verifiedTokenObj.userId, liked: userIdLiked });
        if (validateLike) return res.status(400).send({ message: "Unable to like more than once." });
        const userLikeResponse = new UserLikes({ liked: userIdLiked, likedBy: verifiedTokenObj.userId })
        await userLikeResponse.save();

        res.send({
            message: `You have liked ${userData.name}`,
        });

    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
};

export default like;