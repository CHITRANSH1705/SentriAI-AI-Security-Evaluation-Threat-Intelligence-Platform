import { Router, Request, Response } from 'express';
import { ProviderFactory } from '../providers/ProviderFactory';
import { ProviderConfig } from '../providers/ProviderInterface';

export const settingsRouter = Router();

settingsRouter.post('/test', async (req: Request, res: Response): Promise<any> => {
  try {
    const config = req.body as ProviderConfig;
    
    if (!config || !config.provider) {
      return res.status(400).json({ success: false, error: 'Invalid configuration' });
    }

    const adapter = ProviderFactory.getAdapter(config.provider);
    const isConnected = await adapter.testConnection(config);
    
    if (isConnected) {
      return res.json({ success: true, message: 'Connection successful' });
    } else {
      return res.status(400).json({ success: false, error: 'Connection failed' });
    }

  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
