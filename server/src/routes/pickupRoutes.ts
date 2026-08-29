import { Router } from "express";
import { listPickups, getPickup, createPickup, updatePickupStatus } from "../controllers/pickupController";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.get("/", listPickups);
router.get("/:id", getPickup);
router.post("/", protect, authorize("USER", "ADMIN"), createPickup);
router.patch("/:id/status", protect, authorize("RECYCLER", "ADMIN"), updatePickupStatus);

export default router;
