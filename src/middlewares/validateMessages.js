import messageSchema from "../schemas/messagesSchema.js";

export function validateMessages(req, res, next){
    const validation = messageSchema.validate(req.body, { abortEarly: true })
    if (validation.error) {
        res.sendStatus(422)
        return;
    }
    next();
}