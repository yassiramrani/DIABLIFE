import { API_BASE } from './env';

/**
 * Trigger emergency call when glucose is critical for too long.
 * @param {number} glucoseValue - Current glucose in mg/dL
 * @param {number} durationMinutes - Minutes the level has been critical
 * @param {'low'|'high'} type - Whether it's hypoglycemia or hyperglycemia
 */
export async function triggerEmergencyCall(glucoseValue, durationMinutes, type = 'abnormal') {
  const res = await fetch(`${API_BASE}/api/emergency-call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      glucoseValue: Number(glucoseValue),
      durationMinutes: Number(durationMinutes),
      type,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Emergency call failed');
  }
  return data;
}
