import Joi from '@hapi/joi';


export const registerValidation = (data: Object) => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'de', 'io'] } }),
        password: Joi.string().min(6).required(),
        likes: Joi.number()
    });
    return schema.validate(data);

}

export const loginValidation = (data: Object) => {
    const schema = Joi.object().keys({
        email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'de', 'io'] } }),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);

}

export const updatePasswordValidation = (data: Object) => {
    const schema = Joi.object().keys({
        oldPassword: Joi.string().min(6).required(),
        newPassword: Joi.string().min(6).required().invalid(Joi.ref('oldPassword')),
        confirmPassword: Joi.string().min(6).required().valid(Joi.ref('newPassword'))
    });
    return schema.validate(data);

}