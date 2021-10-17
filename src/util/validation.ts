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
