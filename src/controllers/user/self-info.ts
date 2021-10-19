import { RequestHandler } from 'express';
import User, { UserInterface } from '../../models/Users';
import { verifyAndDecode } from "../../util/jwt";
import { JwtPayload } from "jsonwebtoken"
import logger from '../../logger';

const selfInfo: RequestHandler = async (req: any, res) => {
    try {
        const verifiedTokenObj: JwtPayload = verifyAndDecode(req.header("Authorization"));
        const userData: UserInterface = await User.findById(verifiedTokenObj.userId, "email name") // include '-_id' if we want to exclude _id from being retrieved
        res.send({
            message: "User Information Data",
            user: userData
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
};

export default selfInfo;