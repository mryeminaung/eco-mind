import { Router } from "express";
import { listRequests, getRequest, createRequest, updateRequestStatus, deleteRequest } from "../controllers/requestController";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.get("/", protect, listRequests);
router.get("/:id", protect, getRequest);
router.post("/", protect, authorize("USER", "ADMIN"), createRequest);
router.patch("/:id/status", protect, authorize("RECYCLER", "ADMIN"), updateRequestStatus);
router.delete("/:id", protect, deleteRequest);

export default router;
