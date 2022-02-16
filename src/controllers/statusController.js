import db from "../database.js";


export async function postStatus(){
    const { User } = req.headers;
    
    try {
        const participant = await db.collection("participants").participantsCollection.findOne({ name: User })
    
        if (!participant) {
            res.status(404)
        } else {
            const update = await db.collection("participants").participantsCollection.updateOne({
                _id: participant._id
            }, {
                $set: { lastStatus: Date.now() }
    
            })
            res.sendStatus(200)
    
        }
    } catch (error) {
        res.sendStatus(500)
    }


}

