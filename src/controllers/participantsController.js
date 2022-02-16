import db from "../database.js";
import dayjs from "dayjs";

export async function getParticipants(req,res){
        try {
            const participants = db.collection("participants").find({}).toArray();
            res.send(participants)
    
        } catch (error) {
            res.sendStatus(500)
        }
    
}

export async function postParticipants(req,res){
        const { name } = req.body;
        try {
            const participant = await db.collection("participants").findOne({ name });

            if (participant) {
                res.sendStatus(409);
            } else {
                await db.collection("participants").insertOne({ name, lastStatus: Date.now() });
                await db.collection("messages").insertOne({
                    from: name,
                    to: 'Todos',
                    text: 'entra na sala...',
                    type: 'status',
                    time: dayjs().format('HH:mm:ss')
                });
                
                res.sendStatus(201);
            }
        } catch (error) {
            res.sendStatus(500)
        }
}

