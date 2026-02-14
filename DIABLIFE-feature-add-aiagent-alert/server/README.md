# DIABLIFE Emergency Call API

Backend that triggers a Twilio voice call to an emergency contact when glucose stays critical (low or high) for 15+ minutes.

## Setup

1. Install dependencies:
   ```bash
   cd server && npm install
   ```

2. Copy env example and set your Twilio credentials (never commit `.env`):
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your real values:
   - `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` — from [Twilio Console](https://console.twilio.com)
   - `TWILIO_FROM_NUMBER` — your Twilio phone number (E.164, e.g. `+1234567890`)
   - `EMERGENCY_TO_NUMBER` — emergency contact (E.164)

3. Start the server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:3001`.

## Frontend

From the `diabete project` folder run the app (e.g. `npm run dev`). It will call `http://localhost:3001` by default. To use another URL set `VITE_API_URL` in `.env`.

## Conditions

- **Low:** glucose &lt; 70 mg/dL for ≥ 15 minutes → emergency call.
- **High:** glucose &gt; 180 mg/dL for ≥ 15 minutes → emergency call.

User can also tap **Call emergency now** to trigger the call immediately when in critical range.
