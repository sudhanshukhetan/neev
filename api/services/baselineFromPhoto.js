/**
 * api/services/baselineFromPhoto.js
 * Calls Gemini Vision to extract a baseline from an uploaded photo.
 * Hard 8s total timeout with automatic fallback to secondary model and deterministic engine.
 */

import { sanitizeBaseline } from './sanitizeBaseline.js';
import { deterministicBaseline } from './deterministicBaseline.js';

const PRIMARY_MODEL = process.env.GEMINI_PRIMARY_MODEL || 'gemini-2.5-flash';
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.0-flash';

const BASELINE_PROMPT = `You are a visual site assessor reviewing a street-level photo of an Indian urban lane or colony.
Estimate the following baseline fields from what you can see. Return ONLY valid JSON — no markdown fences, no preamble.
Return null for any field you cannot estimate. Do NOT assess structural safety.

{
  "laneWidthM": <number 1-20, estimated carriageway width in metres>,
  "obstructionM": <number 0-5, estimated obstruction (vendors/vehicles/rubble) in metres encroaching into carriageway>,
  "drainCondition": <"none"|"open"|"clogged"|"covered">,
  "greenPct": <number 0-100, % visible green cover>,
  "floorsAvg": <number 1-8, average visible floor count of buildings>,
  "wiresVisible": <true|false, overhead wires/cables visible>,
  "buildingConditionScore": <number 0-100, visual condition score: 0=severely distressed, 100=new/well maintained>,
  "confidence": {
    "laneWidthM": <0-1>,
    "obstructionM": <0-1>,
    "drainCondition": <0-1>,
    "greenPct": <0-1>,
    "floorsAvg": <0-1>,
    "wiresVisible": <0-1>,
    "buildingConditionScore": <0-1>
  }
}`;

async function callGeminiModel(modelName, imageBuffer, mimeType) {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: modelName });

  const imagePart = {
    inlineData: {
      data: imageBuffer.toString('base64'),
      mimeType: mimeType || 'image/jpeg',
    },
  };

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [imagePart, { text: BASELINE_PROMPT }] }],
    generationConfig: { responseMimeType: 'application/json' },
  });

  return result.response.text();
}

export async function getBaseline(imageBuffer, mimeType = 'image/jpeg') {
  if (!process.env.GEMINI_API_KEY || !imageBuffer || imageBuffer.length === 0) {
    return deterministicBaseline(imageBuffer);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s hard timeout

  try {
    const responseText = await Promise.race([
      (async () => {
        try {
          return await callGeminiModel(PRIMARY_MODEL, imageBuffer, mimeType);
        } catch (primaryErr) {
          console.warn(`[neev] Primary model ${PRIMARY_MODEL} failed:`, primaryErr.message);
          return await callGeminiModel(FALLBACK_MODEL, imageBuffer, mimeType);
        }
      })(),
      new Promise((_, reject) =>
        controller.signal.addEventListener('abort', () =>
          reject(new Error('Gemini timeout: 8s exceeded'))
        )
      ),
    ]);

    clearTimeout(timeoutId);
    return sanitizeBaseline(responseText, imageBuffer);
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('[neev] Baseline extraction failed, using deterministic fallback:', err.message);
    return deterministicBaseline(imageBuffer);
  }
}
