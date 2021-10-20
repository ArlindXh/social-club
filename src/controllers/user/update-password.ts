import { RequestHandler, Request, Response } from 'express';
import User, { UserInterface } from '../../models/Users';
import { verifyAndDecode } from "../../util/jwt";
import { JwtPayload } from "jsonwebtoken"
import { updatePasswordValidation } from "../../util/validation";
import { validatePassword, hashPassword } from "../../util/auth";
import logger from '../../logger';

const updatePassword: RequestHandler = async (req: Request, res: Response) => {
    try {
        const verifiedTokenObj: JwtPayload = verifyAndDecode(req.header("Authorization"));
        let validation = updatePasswordValidation(req.body);
        if (validation.error) {
            let errorMessage = validation.error?.details[0]?.message;
            return res.status(400).send(errorMessage)
        }
        const { oldPassword, newPassword } = req.body;
        const data: UserInterface = await User.findById(verifiedTokenObj.userId);
        const correctPassword = await validatePassword(oldPassword, data.password);
        if (!correctPassword) return res.status(400).send({ message: "Incorrect password" });
        
        const hashedPassword = await hashPassword(newPassword);

        await User.updateOne({ email: data.email }, { password: hashedPassword })

        res.send({
            message: "User password successfully updated",
        });

    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
};

export default updatePassword;