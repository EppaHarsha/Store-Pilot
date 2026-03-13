import { Router } from "express";
import { sendDailySummary } from "../jobs/dailySummary.js";

const router = Router();

router.post("/send-summary", async (req, res) => {
  try {
    await sendDailySummary();
    res.json({ success: true, message: "Summary sent successfully" });
  } catch (error) {
    console.error("Error in demo send-summary route:", error);
    res.status(500).json({ success: false, error: "Failed to send summary" });
  }
});

export default router;
