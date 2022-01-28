import express, {json} from 'express';
import cors from 'cors';
import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
import dayjs from 'dayjs';
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

app.listen(5000, ()=>{
    console.log("Servidor rodando na porta 5000")
});

let db;
const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect().then(()=>{
    db = mongoClient.db('apiuol')
})

const userModel = joi.object({
    name: joi.string().required(),
})
const messageModel = joi.object({
    to: joi.string().required(),
    text: joi.string().required(),
    type: joi.valid("message", "private_message").required()
})



app.get('/participants', async (req, res) => {

    try {
        await mongoClient.connect();
        const dbParticipants = mongoClient.db("apiuol");
        const participantsCollection = dbParticipants.collection("participants")
        const participants = await participantsCollection.find({}).toArray();
        
        res.send(participants)
        mongoClient.close()

    }catch(error){
        res.status(500)
        mongoClient.close();
    }

});

app.get('/messages', async (req, res)=>{
    const limit = req.query.limit;
    const user  = req.headers.user;
    
    
    try{
        await mongoClient.connect();
        const dbMessages = mongoClient.db("apiuol");
        const messagesCollection = dbMessages.collection("messages")
        const messages = await messagesCollection.find({}).toArray();
        
        const filteredMessages = messages.filter((m)=> {
            (m.type === "message" || m.type === "status"|| m.to === "Todos" || m.to === user || m.from === user);
        });
    
        if(!limit){
            res.send(filteredMessages)
        }else{
            res.send(filteredMessages.filter(- limit))
        }
            
        }catch(error){
            res.status(500).send(error)
        }
        mongoClient.close();
    


})

app.post('/participants', async (req, res)=>{

    const {name}= req.body;
    const validation = userModel.validate(req.body, {abortEarly:true})
        if(validation.error){
            res.send(validation.error.details)
            return;
        }

    
        try {
            await mongoClient.connect();
            const dbParticipants = mongoClient.db("apiuol");
            const participantsCollection = dbParticipants.collection("participants")
            const participant = await participantsCollection.findOne({name})

            if(participant){
                res.sendStatus(409)
            }else{
                await participantsCollection.insertOne({ name, lastStatus: Date.now()});
                await mongoClient.connect();
                const dbMessages = mongoClient.db("apiuol");
                const messagesCollection =  dbMessages.collection("messages")
                const messages = await messagesCollection.insertOne({
                    from: name, 
                    to: 'Todos', 
                    text: 'entra na sala...', 
                    type: 'status',
                    time: dayjs().format('HH:mm:ss')
                });

                res.sendStatus(201);

            }
        } catch (error) {
            res.status(500).send(error)
        }

        mongoClient.close()
    
})


app.post('/messages', async (req, res)=>{
        const {user} = req.headers
        const message = req.body

        const validation = messageModel.validate(req.body, {abortEarly:true})
        if(validation.error){
            res.send(validation.error.details)
            return;
        }

        try{
            await mongoClient.connect();
                const dbMessages = mongoClient.db("apiuol");
                const messagesCollection =  dbMessages.collection("messages")
                const messages = await messagesCollection.insertOne({
                    from: user, 
                    to: message.to, 
                    text: message.text, 
                    type: message.type,
                    time: dayjs().format('HH:mm:ss')
                });
                res.status(201)
        }catch{

        }

})