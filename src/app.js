import express, {json} from 'express';
import cors from 'cors';
import {MongoClient} from 'mongodb';


const app = express();

app.use(cors());
app.use(express.json());

app.listen(5000, ()=>{
    console.log("Servidor rodando na porta 5000")
});

let db;

const mongoClient = new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=apiuol');
mongoClient.connect().then(()=>{
    db = mongoClient.db('apiuol')
})



app.get('/participants', async (req, res) => {

    try {
        await mongoClient.connect();
        const dbParticipants = mongoClient.db("allParticipants");
        const participantsCollection = dbParticipants.collection("participants")
        const participants = await participantsCollection.find({}).toArray();
        
        res.send(participants)
        mongoClient.close()

    }catch(error){
        res.status(500)
        mongoClient.close();
    }


})


