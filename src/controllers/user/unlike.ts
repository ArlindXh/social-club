import { RequestHandler } from 'express';
import UserLikes, { UserLikesInterface } from '../../models/UserLikes';
import User, { UserInterface } from '../../models/Users';
import { verifyAndDecode } from "../../util/jwt";
import { JwtPayload } from "jsonwebtoken"
import logger from '../../logger';

const unlike: RequestHandler = async (req: any, res) => {
    try {
        const verifiedTokenObj: JwtPayload = verifyAndDecode(req.header("Authorization"));
        const { id: userIdLiked } = req.params

        const userData: UserInterface = await User.findById(userIdLiked, "name");
        const validateLike = await UserLikes.findOne({liked: userIdLiked, likedBy: verifiedTokenObj.userId });
        if (!validateLike) return res.status(400).send({ message: "Unable to unlike." });
        await UserLikes.deleteOne({liked:userIdLiked, likedBy: verifiedTokenObj.userId})
        res.send({
            message: `You have unliked ${userData.name}`,
        });

    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
};

export default unlike;