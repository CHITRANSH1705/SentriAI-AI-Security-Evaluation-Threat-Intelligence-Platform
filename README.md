#  AI Security Operations Center (AI SOC Platform)

> **A full-stack, defensive-engineering platform for evaluating, monitoring, and analyzing LLM security posture in real time.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MITRE ATLAS](https://img.shields.io/badge/MITRE-ATLAS-red)](https://atlas.mitre.org/)

---

##  Overview
The **AI SOC Platform** is a defensive security evaluation dashboard built for engineers and researchers who need to observe, measure, and analyze the behavior of Large Language Models (LLMs) against adversarial attacks. It provides real-time metrics, threat intelligence mapped to **MITRE ATLAS**, and behavioral drift analysis — all through a modern, dark-themed UI.

> ⚠️ **This platform is built exclusively for defensive evaluation and observability. It does not contain automated exploitation engines, jailbreak generators, or dynamic attack mutation systems.**
---
##  Features

| Feature | Description |
|---|---|
| 🔬 **Live Evaluation Engine** | Run real prompts against OpenAI, Anthropic Claude, or a local Ollama model and score the response instantly |
| 📊 **Security Scoring** | Heuristic analysis scoring for Prompt Injection Risk, Jailbreak Detection, System Prompt Leakage, Data Exfiltration, Hallucination Risk, and Toxicity |
| 🗺️ **MITRE ATLAS Mapping** | Automatically maps detected threats to ATLAS adversarial ML technique IDs (e.g. `AML.T0051.000`) |
| 📈 **Behavioral Drift Analysis** | Tracks semantic drift, hallucination risk trends, and consistency scores across simulation rounds |
| ⚖️ **Model Comparison** | Side-by-side comparison of two LLM providers on the same prompt set |
| 📋 **Reports Page** | Aggregated findings with severity breakdown and a PDF-ready export layout |
| 🔐 **Threats Dashboard** | Real-time threat event feed with CVE-style severity ratings and incident tracking |
| ⚙️ **Settings & Provider Config** | Configure API keys and model endpoints from within the UI — no manual `.env` editing required |

---

## 🏗️ Architecture

```
ai-security-platform/
├── frontend/               # React 19 + Vite 8 + TailwindCSS v4 SPA
│   └── src/
│       ├── components/     # Page-level React components
│       │   ├── Dashboard.tsx        # Main security overview
│       │   ├── EvaluationPage.tsx   # Live LLM evaluation runner
│       │   ├── BehaviorPage.tsx     # Semantic drift & behavioral analytics
│       │   ├── ThreatsPage.tsx      # MITRE ATLAS threat intelligence feed
│       │   ├── ComparePage.tsx      # Side-by-side model comparison
│       │   ├── ReportsPage.tsx      # Aggregated reports & export
│       │   └── SettingsPage.tsx     # Provider & API key configuration
│       ├── context/
│       │   └── SimulationContext.tsx  # Global state (React Context)
│       └── types/                     # Shared TypeScript interfaces
│
└── backend/                # Node.js + Express API server
    └── src/
        ├── api/
        │   ├── evaluate.ts   # POST /api/evaluate — runs LLM call + analysis
        │   └── settings.ts   # GET/POST /api/settings — provider config
        ├── analysis/
        │   └── SecurityEngine.ts  # Core heuristic security scoring engine
        └── providers/
            ├── ProviderInterface.ts   # Shared LLM provider contract
            ├── ProviderFactory.ts     # Factory to select OpenAI / Ollama
            └── adapters/
                ├── OpenAIAdapter.ts   # OpenAI & Anthropic API adapter
                └── OllamaAdapter.ts   # Local Ollama adapter
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20 or later
- **npm** v9 or later
- One of the following LLM backends:
  - [Ollama](https://ollama.com/) running locally on port `11434` (free, local, no API key needed)
  - An **OpenAI** API key (`sk-...`)
  - An **Anthropic** API key

---

### Option 1 — Manual Setup (Recommended for Development)

**1. Clone the repository**
```bash
git clone https://github.com/<your-username>/ai-security-platform.git
cd ai-security-platform
```

**2. Install & run the backend**
```bash
cd backend
npm install
npm run dev
# Backend starts at http://localhost:3001
```

**3. Install & run the frontend** (in a new terminal)
```bash
cd frontend
npm install
npm run dev
# Frontend starts at http://localhost:5173
```

**4. Open the app**

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

**5. Configure your LLM provider**

Go to **Settings** in the navbar and enter your API key or confirm your Ollama endpoint.

---

### Option 2 — Docker Compose

```bash
# From the root of the repository
docker-compose up --build
```

Then open [http://localhost:5173](http://localhost:5173).

---

## ⚙️ Environment Variables

The backend reads the following environment variables. You can also configure these from the **Settings** page in the UI.

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=3001

# LLM Provider (openai | anthropic | ollama)
PROVIDER=ollama

# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Ollama (local)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

> **Note:** Never commit your `.env` file. It is already in `.gitignore`.

---

## 🔍 How the Security Engine Works

The `SecurityEngine` in `backend/src/analysis/SecurityEngine.ts` performs a fast, heuristic-based analysis on every (prompt, response) pair:

| Metric | Detection Method |
|---|---|
| **Prompt Injection Risk** | Pattern-matched against known injection keywords |
| **Jailbreak Detection** | Checks for phrases like `ignore previous`, `system override`, `DAN` |
| **System Prompt Leakage** | Scans the response for phrases like `as an AI`, `my instructions` |
| **MITRE ATLAS Mapping** | Each finding is tagged with the corresponding `AML.T####.###` technique |
| **Overall Score** | 0–100 score where 100 = no detected risk |

> In a production deployment, the heuristic engine would be replaced by a **Judge LLM** or an **ML classifier** for higher precision.

---

## 🗺️ MITRE ATLAS Techniques Referenced

| Technique ID | Name |
|---|---|
| `AML.T0051.000` | LLM Prompt Injection |
| `AML.T0024.001` | Exfiltration via ML Inference API — System Prompt |

See the full taxonomy at [atlas.mitre.org](https://atlas.mitre.org/).

---

## 🖥️ Screenshots

> _Coming soon — run the app locally to see the live dashboard._

---

## 🛠️ Tech Stack

### Frontend
| Library | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| TailwindCSS | 4 | Utility-first styling |
| Framer Motion | 12 | Page & component animations |
| Recharts | 3 | Data visualization charts |
| React Router | 8 | Client-side routing |
| TanStack Query | 5 | Server state management |
| Lucide React | latest | Icon system |
| Heroicons | 2 | Additional icon set |

### Backend
| Library | Version | Purpose |
|---|---|---|
| Express | 4 | HTTP API server |
| OpenAI SDK | 4 | OpenAI & compatible API client |
| Anthropic SDK | 0.33 | Claude API client |
| Google GenAI | latest | Gemini API client |
| dotenv | 16 | Environment variable loading |
| TypeScript | 5 | Type safety |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for the full guidelines.

---

## 🔒 Security

This tool is built for **defensive security research only**. Please review [SECURITY.md](SECURITY.md) before use.

- Do **not** run this tool against production AI systems without proper authorization.
- Do **not** use this platform to build offensive attack tooling.
- Report security vulnerabilities by opening a GitHub Issue.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

## 👤 Author

**Chitransh Saxena**

---

*Built with React + Vite · Powered by MITRE ATLAS · AI SOC Platform v1.0.0 — Defensive Engineering Mode*
