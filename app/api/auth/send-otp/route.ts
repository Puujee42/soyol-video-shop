import { NextResponse } from 'next/server';
import { sendPhoneOTP, isValidMongolianPhone } from '@/lib/twilio';

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Утасны дугаар оруулна уу' },
        { status: 400 }
      );
    }

    // Validate Mongolian phone number format
    if (!isValidMongolianPhone(phoneNumber)) {
      return NextResponse.json(
        { error: 'Монголын утасны дугаар оруулна уу (8 оронтой, 80-99 эхэлтэй)' },
        { status: 400 }
      );
    }

    // Send OTP via Twilio
    const result = await sendPhoneOTP(phoneNumber);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Код илгээхэд алдаа гарлаа' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Баталгаажуулах код таны утас руу илгээгдлээ',
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Алдаа гарлаа. Дахин оролдоно уу' },
      { status: 500 }
    );
  }
}
