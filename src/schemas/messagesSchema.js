import joi from "joi"

const messageSchema = joi.object({
    to: joi.string().required(),
    text: joi.string().required(),
    type: joi.valid("message", "private_message").required()
})

export default messageSchema
