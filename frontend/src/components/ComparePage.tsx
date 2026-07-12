import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui';
import { useSimulation } from '../context/SimulationContext';
import { PlayIcon, ScaleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const AVAILABLE_MODELS = [
  { provider: 'OpenAI', model: 'gpt-3.5-turbo' },
  { provider: 'OpenAI', model: 'gpt-4o' },
  { provider: 'Ollama', model: 'llama3' },
  { provider: 'Anthropic', model: 'claude-3-5-sonnet' },
];

export default function ComparePage() {
  const { state, updateLiveState } = useSimulation();
  const [prompt, setPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState<{provider: string, model: string}[]>([]);
  const [evaluating, setEvaluating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const toggleModel = (m: {provider: string, model: string}) => {
    const exists = selectedModels.find(x => x.provider === m.provider && x.model === m.model);
    if (exists) {
      setSelectedModels(selectedModels.filter(x => !(x.provider === m.provider && x.model === m.model)));
    } else {
      if (selectedModels.length >= 3) {
        setError('You can compare up to 3 models at a time.');
        return;
      }
      setSelectedModels([...selectedModels, m]);
      setError('');
    }
  };

  const handleRunComparison = async () => {
    if (!prompt || selectedModels.length === 0) return;
    
    const saved = sessionStorage.getItem('aiConfig');
    if (!saved) {
      setError('No AI Provider configured. Please go to Settings to configure your API key (it will be used across providers where applicable, though realistically you need specific keys per provider).');
      return;
    }
    const baseConfig = JSON.parse(saved);

    setEvaluating(true);
    setError('');
    setResults([]);

    try {
      const promises = selectedModels.map(m => {
        // Merge the selected provider/model with the base api key config
        // In a real app, Settings would store multiple keys.
        const config = { ...baseConfig, provider: m.provider, modelName: m.model };
        return fetch('http://localhost:3001/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, config })
        }).then(r => r.json());
      });

      const responses = await Promise.all(promises);
      const successful = responses.filter(r => r.success);
      if (successful.length === 0) {
        setError('All evaluations failed. Check API keys and network.');
      } else {
        setResults(successful);
        
        // Push best/worst or average to live state if in live mode
        if (state.mode === 'live') {
          // Average the scores to reflect the combined run
          const avgScore = successful.reduce((sum, r) => sum + r.analysis.overallScore, 0) / successful.length;
          const totalTokens = successful.reduce((sum, r) => sum + r.analysis.tokenUsage, 0);
          
          let newEvents: any[] = [];
          successful.forEach(r => {
             const evts = r.analysis.findings.map((f: any) => ({
               id: `live-${Date.now()}-${Math.random().toString(36).substring(2,6)}`,
               timestamp: new Date().toLocaleTimeString(),
               type: f.severity,
               message: `Live Compare (${r.provider}): ${f.type} - ${f.description}`,
               source: r.provider,
               technique: f.mitreTechnique
             }));
             newEvents = [...newEvents, ...evts];
          });

          updateLiveState({
            securityScore: avgScore,
            tokensAnalyzed: state.tokensAnalyzed + totalTokens,
            events: [...newEvents, ...state.events].slice(0, 15)
          });
        }
      }
    } catch (e: any) {
      setError(`Network error: ${e.message}`);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex items-center gap-3 mb-2">
        <ScaleIcon className="w-8 h-8 text-fuchsia-400" />
        <h1 className="text-2xl font-bold">Compare Models</h1>
      </div>

      {state.mode === 'simulation' && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl flex items-center gap-3">
          <ExclamationTriangleIcon className="w-6 h-6 shrink-0" />
          <p className="text-sm font-medium">You are currently in Simulation Mode. Switch to Live Mode to run real comparisons.</p>
        </div>
      )}

      <Card className="border-fuchsia-500/20">
        <CardHeader title="Evaluation Setup" subtitle="Select models and provide a prompt for side-by-side comparison." />
        <CardContent className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-semibold text-slate-300 mb-2 block">Select Models to Compare (Max 3)</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_MODELS.map((m, i) => {
                const isSelected = selectedModels.some(x => x.provider === m.provider && x.model === m.model);
                return (
                  <button
                    key={i}
                    onClick={() => toggleModel(m)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      isSelected 
                        ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {m.provider} - {m.model}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <textarea 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Enter your adversarial prompt here..."
              className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm font-mono text-slate-300 outline-none focus:border-fuchsia-500 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 items-center">
            <button 
              onClick={handleRunComparison}
              disabled={evaluating || !prompt || selectedModels.length === 0 || state.mode === 'simulation'}
              className="bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
            >
              {evaluating ? <span className="animate-pulse">Evaluating...</span> : <><PlayIcon className="w-5 h-5" /> Run Comparison</>}
            </button>
            {error && <span className="text-sm text-rose-400 font-medium">{error}</span>}
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((r, idx) => (
            <Card key={idx} className="border-slate-700/50 flex flex-col h-full">
              <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                <h3 className="font-bold text-lg text-slate-200">{r.provider}</h3>
                <span className="text-xs text-slate-400 font-mono">{r.model}</span>
              </div>
              <div className="p-4 flex flex-col gap-4 flex-1">
                <div className="flex justify-between items-end border-b border-slate-800 pb-3">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Security Score</span>
                  <span className={`text-3xl font-black ${r.analysis.overallScore < 70 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {r.analysis.overallScore.toFixed(1)}
                  </span>
                </div>
                
                <div className="space-y-2 flex-1">
                  <Stat label="Injection Risk" val={`${(r.analysis.promptInjectionRisk * 100).toFixed(0)}%`} isBad={r.analysis.promptInjectionRisk > 0.5} />
                  <Stat label="Jailbreak" val={`${(r.analysis.jailbreakDetection * 100).toFixed(0)}%`} isBad={r.analysis.jailbreakDetection > 0.5} />
                  <Stat label="System Leakage" val={`${(r.analysis.systemPromptLeakage * 100).toFixed(0)}%`} isBad={r.analysis.systemPromptLeakage > 0.5} />
                  <Stat label="Latency" val={`${r.analysis.latencyMs}ms`} />
                  <Stat label="Tokens" val={r.analysis.tokenUsage} />
                </div>

                <div className="mt-2 pt-3 border-t border-slate-800">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2 block">Response Snippet</span>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-xs font-mono text-slate-400 h-24 overflow-y-auto">
                    {r.response}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, val, isBad }: { label: string, val: any, isBad?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className={`font-semibold ${isBad ? 'text-rose-400' : 'text-slate-200'}`}>{val}</span>
    </div>
  );
}
