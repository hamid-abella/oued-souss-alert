import { Router, type Request, type Response } from "express";
import Zone from "../models/Zone.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
