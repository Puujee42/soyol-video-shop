import twilio from 'twilio';

// Twilio client initialization
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

// Initialize Twilio client only if credentials exist
let twilioClient: ReturnType<typeof twilio> | null = null;

if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
}

/**
 * Send OTP to Mongolian phone number
 * @param phoneNumber - 8-digit Mongolian phone number (e.g., 99887766)
 * @returns Promise with success status
 */
export async function sendPhoneOTP(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate Mongolian phone number format
    if (!isValidMongolianPhone(phoneNumber)) {
      return {
        success: false,
        error: 'Монголын утасны дугаар оруулна уу (8 оронтой, 80-99 эхэлтэй)',
      };
    }

    // Format phone number for international use (+976 prefix)
    const formattedPhone = `+976${phoneNumber}`;

    // Check if Twilio is configured
    if (!twilioClient || !verifyServiceSid) {
      console.error('Twilio not configured - using mock OTP');
      // In development/test mode, return success (mock)
      return {
        success: true,
        error: undefined,
      };
    }

    // Send OTP using Twilio Verify API
    const verification = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: formattedPhone,
        channel: 'sms',
        locale: 'mn', // Mongolian language
      });

    console.log('OTP sent successfully:', verification.status);

    return {
      success: verification.status === 'pending',
    };
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      error: error.message || 'Код илгээхэд алдаа гарлаа',
    };
  }
}

/**
 * Verify OTP code
 * @param phoneNumber - 8-digit Mongolian phone number
 * @param code - 6-digit OTP code
 * @returns Promise with verification status
 */
export async function verifyPhoneOTP(
  phoneNumber: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate inputs
    if (!phoneNumber || !code) {
      return {
        success: false,
        error: 'Дугаар болон код шаардлагатай',
      };
    }

    if (code.length !== 6) {
      return {
        success: false,
        error: 'Код 6 оронтой байх ёстой',
      };
    }

    // Format phone number
    const formattedPhone = `+976${phoneNumber}`;

    // Check if Twilio is configured
    if (!twilioClient || !verifyServiceSid) {
      console.log('Twilio not configured - using mock verification');
      // In development/test mode, accept specific codes
      const isValidMockCode = code === '123456' || code === '000000';
      return {
        success: isValidMockCode,
        error: isValidMockCode ? undefined : 'Код буруу байна',
      };
    }

    // Verify OTP using Twilio Verify API
    const verificationCheck = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: formattedPhone,
        code: code,
      });

    console.log('OTP verification:', verificationCheck.status);

    return {
      success: verificationCheck.status === 'approved',
      error: verificationCheck.status !== 'approved' ? 'Код буруу эсвэл хугацаа дууссан' : undefined,
    };
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      error: error.message || 'Баталгаажуулахад алдаа гарлаа',
    };
  }
}

/**
 * Validate Mongolian phone number format
 * Must be 8 digits and start with valid prefixes
 * @param phoneNumber - Phone number to validate
 */
export function isValidMongolianPhone(phoneNumber: string): boolean {
  // Remove any non-digit characters
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  // Must be exactly 8 digits
  if (cleanPhone.length !== 8) {
    return false;
  }

  // Valid Mongolian mobile prefixes
  const validPrefixes = [
    '80', '85', '86', '88', '89', // Unitel
    '90', '91', '95', '96', '99', // Mobicom
    '94', '98',                     // Skytel
  ];

  // Check if starts with valid prefix
  const prefix = cleanPhone.substring(0, 2);
  return validPrefixes.includes(prefix);
}

/**
 * Format phone number for display
 * @param phoneNumber - 8-digit phone number
 * @returns Formatted phone number (e.g., 9988 7766)
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  
  return phoneNumber;
}
