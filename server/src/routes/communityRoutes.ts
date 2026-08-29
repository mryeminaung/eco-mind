import { Router } from "express";
import { listEvents, joinEvent } from "../controllers/communityController";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/events", listEvents);
router.post("/events/:id/join", protect, joinEvent);

export default router;
