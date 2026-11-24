import express from 'express';
const router = express.Router();

router.get('/health', (_req, res) => {
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  res.json({
    status: 'ok',
    app: 'Neev',
    version: '1.0.0',
    aiMode: hasApiKey ? 'gemini-vision' : 'verified-engine',
    timestamp: new Date().toISOString(),
  });
});

export default router;
