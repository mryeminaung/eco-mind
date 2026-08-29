import { Router } from "express";
import { deleteUser, getUser, listUsers, updateUser } from "../controllers/userController";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.use(protect, authorize("ADMIN"));

router.get("/", listUsers);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
