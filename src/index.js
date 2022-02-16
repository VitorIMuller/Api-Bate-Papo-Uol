
import express, { json } from 'express';
import cors from 'cors';
import dayjs from 'dayjs';
import router from './routes/index.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use(router)


app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`)
});


setInterval(async () => {
    let timeOut = Date.now() - 10000;
        const participants = await db.collection("participants").participantsCollection.find({}).toArray();
        for (const participant of participants) {
            if (participant.lastStatus > timeOut) {
                const participants = await db.collection("participants").participantsCollection.deleteOne({ _id: participant._id })
                const messages = await db.collection("messages").messagesCollection.insertOne({
                    from: participant,
                    to: "Todos",
                    text: "Sai da Sala ... ",
                    type: "status",
                    time: dayjs().format('HH:mm:ss')
                });
            }
        }
}, 15000);