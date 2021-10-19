import { RequestHandler } from 'express';
import User from '../../models/Users';
import { loginValidation } from "../../util/validation";
import { validatePassword } from "../../util/auth";
import { generateToken } from "../../util/jwt";
import logger from '../../logger';

const login: RequestHandler = async (req: any, res) => {
    try {
        let userValidation = loginValidation(req.body);
        if (userValidation.error) {
            let errorMessage = userValidation.error?.details[0]?.message;
            return res.status(400).send(errorMessage)
        }
        const { email, password } = req.body;

        const data = await User.findOne({ email });
        if (!data) return res.status(400).send({ message: "Email or password is incorrect." });

        const correctPassword = await validatePassword(password, data.password);

        if (!correctPassword) return res.status(400).send({ message: "Email or password is incorrect." });
        let token = generateToken(data._id);
        res.header(
            "auth-token", token
        ).send({
            message: "User logged in successfully",
        });
    } catch (error) {
        logger.error(error);
        res.status(500).send(error);
    }
};

export default login;