import { Router } from "express";
import { listHubs } from "../controllers/hubController";

const router = Router();

router.get("/", listHubs);

export default router;
