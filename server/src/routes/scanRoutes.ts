import { Router } from "express";
import { scanWaste } from "../controllers/scanController";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.post("/", protect, authorize("USER", "ADMIN"), scanWaste);

export default router;
