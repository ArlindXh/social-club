import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {

    const token = jwt.sign({ userId }, process.env.SECRET_TOKEN_KEY)
    return token;
}

export const verifyAndDecode = (token: string): Object => {
    try {
        return jwt.verify(token, process.env.SECRET_TOKEN_KEY)

    } catch (error) {
        throw error;
    }
}