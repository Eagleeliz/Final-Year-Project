
import twilio, { Twilio } from 'twilio';

// Define what data is needed to send an SMS
export interface SmsOptions {
  to: string;      // Phone number to send to
  body: string;    // Message text
}

// Define what we get back from Twilio
export interface SmsResult {
  sid: string;       // Unique message ID from Twilio
  status: string;    // Delivery status
  to: string;        // Phone number we sent to
  timestamp: Date;   // When we sent it
}

export class SmsService {
  private client: Twilio;      // Twilio API connection
  private twilioPhone: string; // Our Twilio phone number

  constructor() {
    // Load Twilio credentials from .env file
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioPhone = process.env.TWILIO_PHONE_NUMBER || '+15707154545';

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials missing. Check your .env file');
    }

    this.client = twilio(accountSid, authToken);
  }

  // Main method to send any SMS
  async sendSms(options: SmsOptions): Promise<SmsResult> {
    try {
      const message = await this.client.messages.create({
        body: options.body,
        from: this.twilioPhone,
        to: options.to,
      });

      console.log(`✅ SMS sent to ${options.to}. ID: ${message.sid}`);
      
      return {
        sid: message.sid,
        status: message.status,
        to: options.to,
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error(`❌ Failed to send SMS to ${options.to}:`, error.message);
      
      // Handle trial account restrictions
      if (error.code === 21608) {
        throw new Error('Trial account: Verify recipient number in Twilio Console first');
      }
      
      if (error.code === 21211) {
        throw new Error('Invalid phone number. Use format: +1234567890');
      }
      
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  // Special method for emergency alerts with formatted messages
  async sendEmergencyAlert(
    to: string,
    userId: number,
    alertType: string,
    severity: 'medium' | 'high' | 'critical',
    description: string
  ): Promise<SmsResult> {
    // Add emojis based on severity level
    let severityEmoji = '🚨';
    if (severity === 'high') severityEmoji = '🚨🚨';
    if (severity === 'critical') severityEmoji = '🚨🚨🚨';

    const body = `${severityEmoji} EMERGENCY ALERT ${severityEmoji}

👤 User ID: ${userId}
⚠️ Severity: ${severity.toUpperCase()}
📋 Type: ${alertType}
📝 Details: ${description}

⏰ Time: ${new Date().toLocaleTimeString()}
📅 Date: ${new Date().toLocaleDateString()}

❗ IMMEDIATE RESPONSE NEEDED`;

    return this.sendSms({ to, body });
  }

  // Check delivery status of a sent message
  async getMessageStatus(messageSid: string): Promise<string> {
    try {
      const message = await this.client.messages(messageSid).fetch();
      return message.status;
    } catch (error) {
      return 'unknown';
    }
  }
}

// Create single instance to use throughout the app
export const smsService = new SmsService();
export default smsService;