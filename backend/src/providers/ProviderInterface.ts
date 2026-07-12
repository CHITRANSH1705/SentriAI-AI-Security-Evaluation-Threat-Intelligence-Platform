export interface ProviderConfig {
  provider: 'openai' | 'anthropic' | 'gemini' | 'ollama' | 'openrouter' | 'azure' | 'custom';
  modelName: string;
  apiKey: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ProviderResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
}

export interface ProviderAdapter {
  evaluate(prompt: string, config: ProviderConfig): Promise<ProviderResponse>;
  testConnection(config: ProviderConfig): Promise<boolean>;
}
