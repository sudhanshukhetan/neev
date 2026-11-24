/**
 * api/health.js
 * Vercel Serverless Function: Health check & active AI mode
 */

export default async function handler(req, res) {
  const aiMode = process.env.GEMINI_API_KEY ? 'gemini-vision' : 'verified-engine';
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'ok',
    version: '2.0.0',
    app: 'Neev — Urban & Greenfield Infrastructure Simulator',
    time: new Date().toISOString(),
    aiMode,
    deployTarget: 'vercel-serverless',
  });
}
