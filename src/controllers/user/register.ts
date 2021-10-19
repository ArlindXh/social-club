import { RequestHandler } from 'express';
import User from '../../models/Users';
import { registerValidation } from "../../util/validation";
import { hashPassword } from "../../util/auth";
import logger from '../../logger';

const register: RequestHandler = async (req: any, res) => {
    try {
        let userValidation = registerValidation(req.body);
        if (userValidation.error) {
            let errorMessage = userValidation.error?.details[0]?.message;
            return res.status(400).send(errorMessage)
        }
        const { name, email, password} = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).send({ message: "User already exists." });
        const hashedPassword = await hashPassword(password);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.send({
            message: 'User registration complete.',
            user: user.toJSON()
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
};

export default register;