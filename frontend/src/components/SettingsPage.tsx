import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui';
import { CpuChipIcon, KeyIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const PROVIDERS = ['OpenAI', 'Anthropic', 'Gemini', 'Ollama', 'OpenRouter', 'Azure', 'Custom'];

export default function SettingsPage() {
  const [provider, setProvider] = useState('OpenAI');
  const [modelName, setModelName] = useState('gpt-3.5-turbo');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error' | 'loading'; msg: string }>({ type: 'idle', msg: '' });

  // Load from session storage
  useEffect(() => {
    const saved = sessionStorage.getItem('aiConfig');
    if (saved) {
      const parsed = JSON.parse(saved);
      setProvider(parsed.provider || 'OpenAI');
      setModelName(parsed.modelName || '');
      setApiKey(parsed.apiKey || '');
      setBaseUrl(parsed.baseUrl || '');
    }
  }, []);

  const handleSave = () => {
    const config = { provider, modelName, apiKey, baseUrl };
    sessionStorage.setItem('aiConfig', JSON.stringify(config));
    setStatus({ type: 'success', msg: 'Configuration saved to session storage.' });
  };

  const handleTest = async () => {
    setStatus({ type: 'loading', msg: 'Testing connection...' });
    try {
      const config = { provider, modelName, apiKey, baseUrl };
      const res = await fetch('http://localhost:3001/api/settings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', msg: 'Connection successful!' });
      } else {
        setStatus({ type: 'error', msg: data.error || 'Connection failed' });
      }
    } catch (e: any) {
      setStatus({ type: 'error', msg: `Error: ${e.message}` });
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 py-6">
      <div className="flex items-center gap-3 mb-2">
        <CpuChipIcon className="w-8 h-8 text-indigo-400" />
        <h1 className="text-2xl font-bold">Provider Configuration</h1>
      </div>

      <Card>
        <CardHeader title="AI Provider Settings" subtitle="Configure your LLM connection for Live Evaluation Mode." />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-400 font-medium">Provider</label>
              <select 
                value={provider} 
                onChange={e => setProvider(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 transition-colors"
              >
                {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-slate-400 font-medium">Model Name</label>
              <input 
                type="text" 
                value={modelName} 
                onChange={e => setModelName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. gpt-4o, claude-3-5-sonnet"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm text-slate-400 font-medium flex items-center gap-1.5">
                <KeyIcon className="w-4 h-4" /> API Key
              </label>
              <input 
                type="password" 
                value={apiKey} 
                onChange={e => setApiKey(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 transition-colors"
                placeholder="sk-..."
              />
              <span className="text-xs text-slate-500">Keys are stored in sessionStorage only and never logged.</span>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm text-slate-400 font-medium flex items-center gap-1.5">
                <GlobeAltIcon className="w-4 h-4" /> Base URL (Optional)
              </label>
              <input 
                type="text" 
                value={baseUrl} 
                onChange={e => setBaseUrl(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. http://localhost:11434"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-800">
            <button 
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-medium transition-colors"
            >
              Save Configuration
            </button>
            <button 
              onClick={handleTest}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-lg font-medium transition-colors"
            >
              Test Connection
            </button>
          </div>

          {status.type !== 'idle' && (
            <div className={`mt-4 p-3 rounded-lg text-sm border ${
              status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              status.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
              'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}>
              {status.msg}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
