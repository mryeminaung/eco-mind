import { Router } from "express";
import { listCenters, getCenter, createCenter, updateCenter, deleteCenter } from "../controllers/recyclingCenterController";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.get("/", listCenters);
router.get("/:id", getCenter);
router.post("/", protect, authorize("ADMIN"), createCenter);
router.put("/:id", protect, authorize("ADMIN"), updateCenter);
router.delete("/:id", protect, authorize("ADMIN"), deleteCenter);

export default router;
