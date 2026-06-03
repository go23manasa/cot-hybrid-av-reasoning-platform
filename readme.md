# Reasoning Behind the Wheel
### A Hybrid Chain-of-Thought Decision System for Autonomous Vehicles

> Research implementation of a web-based evaluation platform comparing LLM, rule-based, RAG-augmented, and hybrid reasoning models for safety-critical autonomous vehicle decisions.

[IEEE Paper](https://ieeexplore.ieee.org/document/11496344)

---

## What This Is

Autonomous vehicles must make safe decisions in milliseconds. This platform evaluates four different decision-making approaches on the same driving scenario side by side:

| Model | Description |
|---|---|
| **Plain LLM** | LLaMA 3.1 8B reasons step-by-step from scenario description alone |
| **Rule Engine** | Deterministic physics — computes TTC, stopping distance, risk score |
| **RAG LLM** | Retrieves relevant traffic rules before LLM inference to reduce hallucination |
| **Hybrid** | Combines LLM reasoning with rule-based safety override — core contribution |

**Key finding from 79 evaluated scenarios:** Plain LLM made dangerous decisions in 8.9% of safety-critical cases. The hybrid model caught every single one through deterministic override.

---

## Features

- **Simulation Page** — Input a driving scenario, select a model, see step-by-step reasoning and decision
- **Compare Page** — Run all 4 models simultaneously on the same scenario
- **Analytics Dashboard** — Decision distribution, risk breakdown, weather analysis, disagreement patterns across all logged runs
- **Persistent Logging** — Every run saved to PostgreSQL with full metrics

---

## Tech Stack

**Backend** — FastAPI · Python · LLaMA 3.1 8B via Groq · FAISS · SQLAlchemy · Supabase PostgreSQL

**Frontend** — React · Vite · Tailwind CSS · Recharts

---

## Project Structure

```
cot-hybrid-av-reasoning-platform/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py          # /run, /compare, /run-rag endpoints
│   │   ├── db/
│   │   │   ├── database.py        # SQLAlchemy engine and session
│   │   │   ├── models.py          # decision_logs table schema
│   │   │   └── init_db.py         # table creation
│   │   ├── models/
│   │   │   └── schema.py          # Pydantic input models
│   │   ├── rag/
│   │   │   ├── retriever.py       # keyword similarity retrieval
│   │   │   └── traffic_rules.json # 25 curated traffic rules
│   │   ├── reasoning/
│   │   │   ├── plain_llm.py       # baseline LLM reasoning
│   │   │   ├── rag_llm.py         # RAG-augmented LLM reasoning
│   │   │   └── rule_engine.py     # physics-based decision engine
│   │   ├── utils/
│   │   │   ├── sanitize.py        # float/infinity sanitizer
│   │   │   └── analytics.py       # analytics aggregation
│   │   └── main.py                # FastAPI app + analytics endpoints
│   └── requirements.txt
└── frontend/
    └── src/
        ├── api/
        │   └── client.js          # axios API calls
        ├── pages/
        │   ├── Home.jsx           # simulation page
        │   ├── Compare.jsx        # model comparison page
        │   └── Analytics.jsx      # dashboard page
        └── components/            # reusable UI components
```

---

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
```

Create `backend/.env`:
```
DATABASE_URL=your_supabase_or_sqlite_url
GROQ_API_KEY=your_groq_api_key
```

For local development without a hosted database, leave `DATABASE_URL` empty — the system falls back to SQLite automatically.

```bash
python create_tables.py
uvicorn app.main:app --reload
```

API docs available at `http://127.0.0.1:8000/docs`

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/run` | Hybrid model decision + DB logging |
| POST | `/run-rag` | RAG-augmented LLM decision |
| POST | `/compare` | All 4 models simultaneously |
| GET | `/analytics/summary` | Total runs, override rate, avg latency |
| GET | `/analytics/risk-analysis` | High/medium/low risk distribution |
| GET | `/analytics/weather` | Decision breakdown by weather |
| GET | `/analytics/disagreements` | NONE/MODERATE/CRITICAL distribution |
| GET | `/health` | Server health check |

**Example request:**
```json
POST /run
{
  "objects": [{"type": "pedestrian", "distance": 4}],
  "ego_speed": 50,
  "weather": "clear",
  "timestamp": "2024-01-01T00:00:00"
}
```

---

## Results

Evaluated across 79 scenarios spanning 4 weather conditions, 4 object types, and speeds from 20–100 km/h.

| Metric | Value |
|---|---|
| Total scenarios evaluated | 79 |
| Overall override rate | 25.3% |
| Critical LLM failure rate | 8.9% |
| Critical override success rate | **100%** |
| Rule engine latency | ~0.02ms |
| LLM latency | ~866ms |

Snow conditions produced the highest override rate (66.7%), confirming that LLMs underestimate stopping distance in adverse weather without explicit rule grounding.

---

## Research Background

This platform implements the Hybrid CoT framework proposed in our IEEE paper. The contribution was a comparative literature survey of 11+ CoT methods across 6 categories. This semester 2 implementation translates that theoretical architecture into a working evaluation system.

## Authors

**Goparaju Manasa** · **Omisha Bajoria** · **Saumya Chandra**

Department of Computer Science and Engineering
National Institute of Technology Agartala

Under the guidance of **Dr. Smita Das**, Assistant Professor, CSE, NIT Agartala

---
