import { Router } from "express";
import { postMessages, getMessages } from "../controllers/messagesController.js";
import { validateMessages } from "../middlewares/validateMessages.js";


const messagesRouter = Router();

messagesRouter.post("/messages", validateMessages, postMessages);
messagesRouter.get("/messages", getMessages)


export default messagesRouter