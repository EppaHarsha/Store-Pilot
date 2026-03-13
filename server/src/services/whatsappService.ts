import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

if (!accountSid || !authToken || !twilioWhatsAppNumber) {
  console.warn("Twilio credentials are not fully configured in environment variables.");
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const sendWhatsAppMessage = async (phone: string, message: string) => {
  if (!client) {
    console.warn("Twilio client is not initialized. Message not sent:", message);
    return;
  }
  
  try {
    const response = await client.messages.create({
      from: twilioWhatsAppNumber,
      to: phone,
      body: message,
    });
    console.log(`WhatsApp message sent successfully to ${phone}. SID: ${response.sid}`);
    return response;
  } catch (error) {
    console.error("WhatsApp sending failed", error);
    throw error;
  }
};
