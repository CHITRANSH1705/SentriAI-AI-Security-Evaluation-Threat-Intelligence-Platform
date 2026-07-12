import OpenAI from 'openai';
import { ProviderAdapter, ProviderConfig, ProviderResponse } from '../ProviderInterface';

export class OpenAIAdapter implements ProviderAdapter {
  async evaluate(prompt: string, config: ProviderConfig): Promise<ProviderResponse> {
    const start = Date.now();
    
    const client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl || undefined,
    });

    const response = await client.chat.completions.create({
      model: config.modelName || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens,
    });

    const end = Date.now();

    return {
      text: response.choices[0]?.message?.content || '',
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      } : undefined,
      latencyMs: end - start,
    };
  }

  async testConnection(config: ProviderConfig): Promise<boolean> {
    try {
      const client = new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseUrl || undefined,
      });
      // A lightweight call just to test auth
      await client.models.list();
      return true;
    } catch (error) {
      console.error('OpenAI Connection Test Failed:', error);
      return false;
    }
  }
}
