import db from "../database.js";
import dayjs from "dayjs";



export async function postMessages(){
        const { user } = req.headers
        const message = req.body
        try {
            const messagesCollection = db.collection("messages").insertOne({
                from: user,
                to: message.to,
                text: message.text,
                type: message.type,
                time: dayjs().format('HH:mm:ss')
            });
            res.status(201)
        } catch {
            res.status(500).send(error)
        }
}

export async function getMessages(){
        const limit = req.query.limit;
        const { user } = req.headers;

        try {       
            const messages = db.collection("messages").find({}).toArray();

            const filteredMessages = messages.filter(messages =>
                messages.type === "message" || messages.to === user || messages.type === "status" || messages.from === user
            )
            if (!limit) {
                res.send(filteredMessages)
            } else {
                const lastMessage = filteredMessages.slice(-limit)
                res.send(lastMessage)
            }   
        } catch (error) {
            res.sendStatus(500)
        }
}