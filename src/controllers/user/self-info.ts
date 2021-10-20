import { RequestHandler } from 'express';
import User, { UserInterface } from '../../models/Users';
import UserLikes, { UserLikesInterface } from '../../models/UserLikes';
import { verifyAndDecode } from "../../util/jwt";
import { JwtPayload } from "jsonwebtoken"
import logger from '../../logger';

const selfInfo: RequestHandler = async (req: any, res) => {
    try {
        const verifiedTokenObj: JwtPayload = verifyAndDecode(req.header("Authorization"));
        const data: UserInterface = await User.findById(verifiedTokenObj.userId, "email name") // include '-_id' if we want to exclude _id from being retrieved
        const userLikes: number = await UserLikes.countDocuments({ liked: verifiedTokenObj.userId })
        let userData = {
            name: data.name,
            email: data.email,
            likes: userLikes
        }
        res.send({
            message: "User Information Data",
            user: userData
        });
    } catch (error) {
        logger.error(error);
        if (error.message === "jwt malformed") {
            res.status(400).send({ message: "Malformed or bad token" })
        } else {
            throw error;
        }
    }
};

export default selfInfo;