import cron from "node-cron";
import Order from "../models/Order.js";
import { sendWhatsAppMessage } from "../services/whatsappService.js";

// Format a date to YYYY-MM-DD for precise querying if needed, or just use start/end of day.
// Here we assume deliveryDate is stored such that querying by 'today' requires a date range.
export const sendDailySummary = async () => {
  try {
    const ownerPhone = process.env.OWNER_PHONE;
    if (!ownerPhone) {
      console.error("OWNER_PHONE is not defined in environment variables.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysOrders = await Order.find({
      deliveryDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    const pendingPayments = await Order.find({
      balance: { $gt: 0 },
    });

    let message = "Good Morning!\n\n";

    if (todaysOrders.length > 0) {
      message += "Today's Orders:\n";
      todaysOrders.forEach((order) => {
        message += `• ${order.customerName} – ${order.serviceName}\n`;
      });
      message += "\n";
    } else {
      message += "No orders due today.\n\n";
    }

    if (pendingPayments.length > 0) {
      message += "Pending Payments:\n";
      pendingPayments.forEach((order) => {
        // Format balance
        const balance = order.balance.toString();
        message += `• ${order.customerName} – ₹${balance}\n`;
      });
    } else {
      message += "No pending payments.\n";
    }

    await sendWhatsAppMessage(ownerPhone, message);
    console.log("Daily summary sent successfully");

  } catch (error) {
    console.error("Failed to send daily summary job", error);
  }
};

export const startDailySummaryJob = () => {
  // Run every minute as requested for the hackathon demo.
  // In a real scenario, this might be '0 9 * * *' (9 AM daily)
  cron.schedule("* * * * *", () => {
    console.log("Running scheduled daily summary job...");
    sendDailySummary();
  });
  console.log("Daily summary cron job initialized (* * * * *).");
};
