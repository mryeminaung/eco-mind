import { Router } from "express";
import { getRates, getUserProfile, calculatePoints, awardPoints } from "../controllers/rewardController";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.get("/rates", getRates);
router.get("/user/:userId", protect, getUserProfile);
router.post("/calculate", protect, calculatePoints);
router.post("/award", protect, authorize("RECYCLER", "ADMIN"), awardPoints);

export default router;
