import { ProviderAdapter, ProviderConfig } from './ProviderInterface';
import { OpenAIAdapter } from './adapters/OpenAIAdapter';
import { OllamaAdapter } from './adapters/OllamaAdapter';

export class ProviderFactory {
  static getAdapter(provider: string): ProviderAdapter {
    switch (provider.toLowerCase()) {
      case 'openai':
      case 'openrouter': // OpenRouter is OpenAI compatible
      case 'azure': // Azure OpenAI is mostly compatible or needs a specific adapter, using OpenAI for now
      case 'custom':
        return new OpenAIAdapter();
      case 'ollama':
        return new OllamaAdapter();
      // Add Anthropic/Gemini adapters as needed
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
