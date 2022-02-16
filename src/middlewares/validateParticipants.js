import userSchema from "../schemas/userSchema.js";

export function validateParticipants(req,res,next){

        const validation = userSchema.validate(req.body, { abortEarly: true })
        if (validation.error) {
            res.sendStatus(422);
            return;
        }
        next();

}