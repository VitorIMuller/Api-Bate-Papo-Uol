import { Router } from "express";
import { validateParticipants } from "../middlewares/validateParticipants.js";
import { postParticipants, getParticipants } from "../controllers/participantsController.js";

const participantsRouter = Router();


participantsRouter.get("/participants", getParticipants)
participantsRouter.post("/participants", validateParticipants, postParticipants);



export default participantsRouter