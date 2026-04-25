import AfricasTalking from 'africastalking';

// Define what data is needed to send an SMS
export interface SmsOptions {
  to: string | string[];  // Single number or array of numbers
  body: string;           // Message text
  senderId?: string;      // Optional sender ID (e.g. "BabyCentre")
}

// Define what we get back from Africa's Talking
export interface SmsResult {
  messageId: string;   // Unique message ID
  status: string;      // Delivery status
  to: string | string[]; // Phone number(s) we sent to
  cost: string;        // Cost of the message
  timestamp: Date;     // When we sent it
}

export class SmsService {
  private sms: any;
  private username: string;
  private senderId: string;


  
  constructor() {

    const apiKey = process.env.AT_API_KEY;
    this.username = process.env.AT_USERNAME || 'sandbox';
    this.senderId = process.env.AT_SENDER_ID || 'BabyCentre';

    if (!apiKey) {
      throw new Error('Africa\'s Talking credentials missing. Check your .env file');
    }

    // Initialize Africa's Talking
    const AT = AfricasTalking({
      apiKey,
      username: this.username,
    });

    this.sms = AT.SMS;
  }

  
  // Add this helper to normalize Kenyan numbers
  private formatPhone(phone: string): string {
    const cleaned = phone.replace(/\s+/g, "").trim();
    
    if (cleaned.startsWith("+254")) return cleaned;           // already correct
    if (cleaned.startsWith("254"))  return `+${cleaned}`;    // missing +
    if (cleaned.startsWith("0"))    return `+254${cleaned.slice(1)}`; // 07XX → +2547XX
    
    return cleaned; // return as-is if unknown format
  }
  

  // Main method to send SMS to one or multiple numbers
async sendSms(options: SmsOptions): Promise<SmsResult> {
  try {
    const recipients = Array.isArray(options.to)
      ? options.to.map((n) => this.formatPhone(n))
      : [this.formatPhone(options.to as string)];

    console.log(`📱 Sending SMS to: ${recipients.join(", ")}`);

    const response = await this.sms.send({
      to: recipients,
      message: options.body,
      // No 'from' — sandbox doesn't support sender IDs
    });

    console.log("📨 AT Full Response:", JSON.stringify(response, null, 2));

    const messageData = response?.SMSMessageData;
    const recipient   = messageData?.Recipients?.[0];

    if (!recipient) {
      const atError = messageData?.Message ?? "Unknown AT error";
      console.error(`❌ AT rejected SMS: ${atError}`);
      throw new Error(`AT rejected SMS: ${atError}`);
    }

    console.log(`✅ SMS sent to ${recipients.join(", ")}. ID: ${recipient.messageId}`);

    return {
      messageId: recipient.messageId,
      status:    recipient.status,
      to:        options.to,
      cost:      recipient.cost,
      timestamp: new Date(),
    };

  } catch (error: any) {
    console.error(`❌ Failed to send SMS to ${options.to}:`, error.message);

    if (error.message?.includes("InvalidSenderId")) {
      throw new Error("Invalid Sender ID — remove AT_SENDER_ID for sandbox");
    }
    if (error.message?.includes("InvalidPhoneNumber")) {
      throw new Error("Invalid phone number format");
    }
    if (error.message?.includes("InsufficientBalance")) {
      throw new Error("Insufficient Africa's Talking account balance");
    }

    throw new Error(`Failed to send SMS: ${error.message}`);
  }
}

async sendBulkSms(phoneNumbers: string[], message: string): Promise<SmsResult[]> {
  try {
    const formatted = phoneNumbers.map((n) => this.formatPhone(n));

    console.log(`📱 Sending bulk SMS to ${formatted.length} recipients`);

    const response = await this.sms.send({
      to: formatted,
      message,
      // No 'from' for sandbox
    });

    console.log("📨 AT Bulk Response:", JSON.stringify(response, null, 2));

    const recipients = response?.SMSMessageData?.Recipients ?? [];

    if (recipients.length === 0) {
      const atError = response?.SMSMessageData?.Message ?? "Unknown AT error";
      throw new Error(`AT rejected bulk SMS: ${atError}`);
    }

    console.log(`✅ Bulk SMS sent to ${recipients.length} recipients`);

    return recipients.map((recipient: any) => ({
      messageId: recipient.messageId,
      status:    recipient.status,
      to:        recipient.number,
      cost:      recipient.cost,
      timestamp: new Date(),
    }));
  } catch (error: any) {
    console.error("❌ Failed to send bulk SMS:", error.message);
    throw new Error(`Failed to send bulk SMS: ${error.message}`);
  }
}
  // Special method for emergency alerts with formatted messages
 async sendEmergencyAlert(
  to: string,
  userFullName: string,  // ← changed from userId: number
  alertType: string,
  severity: 'medium' | 'high' | 'critical',
  description: string
): Promise<SmsResult> {
  let severityEmoji = '-';
  if (severity === 'high') severityEmoji = '--';
  if (severity === 'critical') severityEmoji = '---';

  const body = `${severityEmoji} EMERGENCY ALERT ${severityEmoji}

 Patient: ${userFullName}
 Severity: ${severity.toUpperCase()}
 Type: ${alertType}
 Details: ${description}
 Time: ${new Date().toLocaleTimeString()}
 Date: ${new Date().toLocaleDateString()}

IMMEDIATE RESPONSE NEEDED`;

  return this.sendSms({ to, body });
}



  // Check delivery status of a sent message
  async getMessageStatus(messageId: string): Promise<string> {
    try {
      const response = await this.sms.fetchMessages({
        messageId,
      });
      return response?.SMSMessageData?.Recipients?.[0]?.status || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }
}

// Create single instance to use throughout the app
export const smsService = new SmsService();
export default smsService;