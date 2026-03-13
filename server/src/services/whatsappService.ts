import twilio from "twilio";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
  // eslint-disable-next-line no-console
  console.warn(
    "Twilio WhatsApp environment variables are not fully configured. WhatsApp messages will fail."
  );
}

const client = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null;

interface OrderReadyParams {
  toPhone: string; // E.164, e.g. "+91..."
  customerName: string;
  balance: number;
}

interface PaymentReminderParams {
  toPhone: string;
  customerName: string;
  balance: number;
  dueDate?: Date;
}

function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(0)}`;
}

export async function sendOrderReadyMessage(params: OrderReadyParams): Promise<void> {
  const { toPhone, customerName, balance } = params;

  if (!client || !TWILIO_WHATSAPP_FROM) {
    return;
  }

  const body = [
    `Hi ${customerName},`,
    "",
    "Your order is ready for pickup.",
    `Balance due: ${formatCurrency(balance)}.`
  ].join("\n");

  await client.messages.create({
    from: TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${toPhone}`,
    body
  });
}

export async function sendPaymentReminder(params: PaymentReminderParams): Promise<void> {
  const { toPhone, customerName, balance, dueDate } = params;

  if (!client || !TWILIO_WHATSAPP_FROM) {
    return;
  }

  const dueText = dueDate ? `Due date: ${dueDate.toDateString()}.\n` : "";

  const body = [
    `Hi ${customerName},`,
    "",
    "This is a reminder for your pending payment.",
    `Balance due: ${formatCurrency(balance)}.`,
    dueText
  ]
    .filter(Boolean)
    .join("\n");

  await client.messages.create({
    from: TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${toPhone}`,
    body
  });
}

