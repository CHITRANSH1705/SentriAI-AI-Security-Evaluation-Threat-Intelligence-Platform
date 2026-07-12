import { ProviderAdapter, ProviderConfig, ProviderResponse } from '../ProviderInterface';

export class OllamaAdapter implements ProviderAdapter {
  async evaluate(prompt: string, config: ProviderConfig): Promise<ProviderResponse> {
    const start = Date.now();
    const baseUrl = config.baseUrl || 'http://localhost:11434';
    
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.modelName || 'llama3',
        prompt: prompt,
        stream: false,
        options: {
          temperature: config.temperature,
          num_predict: config.maxTokens,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    const end = Date.now();

    return {
      text: data.response || '',
      usage: {
        promptTokens: data.prompt_eval_count || 0,
        completionTokens: data.eval_count || 0,
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      },
      latencyMs: end - start,
    };
  }

  async testConnection(config: ProviderConfig): Promise<boolean> {
    try {
      const baseUrl = config.baseUrl || 'http://localhost:11434';
      const response = await fetch(`${baseUrl}/api/tags`);
      return response.ok;
    } catch (error) {
      console.error('Ollama Connection Test Failed:', error);
      return false;
    }
  }
}
