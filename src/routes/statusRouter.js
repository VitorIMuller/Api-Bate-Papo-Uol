import { Router } from "express";
import { postMessages, getMessages } from "../controllers/messagesController.js";
import { validateMessages } from "../middlewares/validateMessages.js";


const statusRouter = Router();

statusRouter.post("/messages", validateMessages, postMessages);



export default statusRouter