import { Router, Request, Response } from 'express';
import { ProviderFactory } from '../providers/ProviderFactory';
import { ProviderConfig } from '../providers/ProviderInterface';
import { SecurityEngine } from '../analysis/SecurityEngine';

export const evaluationRouter = Router();

evaluationRouter.post('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { prompt, config } = req.body as { prompt: string, config: ProviderConfig };

    if (!prompt || !config || !config.provider) {
      return res.status(400).json({ error: 'Missing prompt or provider configuration' });
    }

    if (!config.apiKey && config.provider !== 'ollama') {
        return res.status(401).json({ error: 'API Key is required for this provider' });
    }

    const adapter = ProviderFactory.getAdapter(config.provider);
    
    // Evaluate the prompt against the LLM
    const llmResponse = await adapter.evaluate(prompt, config);
    
    // Run Security Analysis
    const analysis = SecurityEngine.analyze(
        prompt, 
        llmResponse.text, 
        llmResponse.latencyMs, 
        llmResponse.usage?.totalTokens || 0
    );

    return res.json({
      success: true,
      provider: config.provider,
      model: config.modelName,
      prompt,
      response: llmResponse.text,
      analysis
    });

  } catch (error: any) {
    console.error('Evaluation Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'An error occurred during evaluation' 
    });
  }
});
