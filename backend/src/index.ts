import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { evaluationRouter } from './api/evaluate';
import { settingsRouter } from './api/settings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // For large prompts

// Routes
app.use('/api/evaluate', evaluationRouter);
app.use('/api/settings', settingsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`🚀 Security Backend running on port ${PORT}`);
});
