import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {

    const token = jwt.sign({ userId }, process.env.SECRET_TOKEN_KEY)
    return token;
}

export const verifyAndDecode = (token: any) : Object => {
    return jwt.verify(token, process.env.SECRET_TOKEN_KEY)
    
}