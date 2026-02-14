import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import twilio from 'twilio';

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;
const emergencyToNumber = process.env.EMERGENCY_TO_NUMBER;

function getClient() {
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.');
  }
  return twilio(accountSid, authToken);
}

/**
 * POST /api/emergency-call
 * Body: { glucoseValue: number, durationMinutes: number, type: 'low' | 'high' }
 * Triggers a Twilio voice call to the emergency contact with the alert message.
 */
app.post('/api/emergency-call', async (req, res) => {
  try {
    const { glucoseValue, durationMinutes, type = 'abnormal' } = req.body;

    if (glucoseValue == null || durationMinutes == null) {
      return res.status(400).json({
        success: false,
        error: 'Missing glucoseValue or durationMinutes',
      });
    }

    if (!fromNumber || !emergencyToNumber) {
      return res.status(503).json({
        success: false,
        error: 'Emergency call not configured. Set TWILIO_FROM_NUMBER and EMERGENCY_TO_NUMBER.',
      });
    }

    const levelDesc = type === 'low' ? 'low' : type === 'high' ? 'high' : 'abnormal';
    const message = `Alert. This is an automated diabetes monitoring system. The patient's glucose level is ${glucoseValue} milligrams per deciliter. This ${levelDesc} level has persisted for ${durationMinutes} minutes. Immediate assistance is recommended.`;

    const client = getClient();
    const call = await client.calls.create({
      twiml: `<Response><Say>${message}</Say></Response>`,
      to: emergencyToNumber,
      from: fromNumber,
    });

    return res.json({
      success: true,
      callSid: call.sid,
      message: 'Emergency call initiated',
    });
  } catch (err) {
    console.error('Emergency call error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to place emergency call',
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
