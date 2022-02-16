import { Router } from "express";
import participantsRouter from "./participantsRouter.js";
import messagesRouter from "./messagesRouter.js";


const router = Router();
router.use(participantsRouter)
router.use(messagesRouter)

export default router