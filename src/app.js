import express, {json} from 'express';
import cors from 'cors';
import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
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
    const limit = parseInt(req.query.limit);
    

    if(!limit){
        try{
            await mongoClient.connect();
            const dbMessages = mongoClient.db("apiuol");
            const messagesCollection = dbMessages.collection("messages")
            const messages = messagesCollection.find({}).toArray();
            res.send(messages)

        }catch(error){

        }
        
    }else{
        try{
            await mongoClient.connect();
            const dbMessages = mongoClient.db("apiuol");
            const messagesCollection = dbMessages.collection("messages")
            const messages = messagesCollection.find({}).toArray();
            
            
            // const messagesFiltradas = [...messages].reverse().slice(0, limit)
            res.send(messages)

        }catch(error){

        }
    }


})

app.post('/participants', async (req, res)=>{

    console.log(req.body.name)

    
        try {
            const validation = userModel.validate(req.body, {abortEarly:true})
            if(validation.error){
                res.send(validation.error.details)
                return;
            }
            
            
            await mongoClient.connect();
            const dbParticipants = mongoClient.db("apiuol");
            const participantsCollection = dbParticipants.collection("participants")
            
            const participants = participantsCollection.insertOne({ name: req.body, lastStatus: Date.now()});

            res.sendStatus(201);

        } catch (error) {
            
        }
    
})

