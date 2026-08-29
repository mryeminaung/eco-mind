import { Router } from "express";
import { listEvents, joinEvent } from "../controllers/communityController";

const router = Router();

router.get("/events", listEvents);
router.post("/events/:id/join", joinEvent);

export default router;
