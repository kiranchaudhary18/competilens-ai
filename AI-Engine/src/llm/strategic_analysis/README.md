# Strategic Analysis Intelligence Module (Module 4)

This module implements the **Strategic Analysis Intelligence** engine. It ingests aggregated competitor evidence and compiles a structured, grounded SWOT analysis, market gap assessment, and recommended action steps.

## Core Features

- **Evidence-Grounded SWOT Analysis**: Generates internal strengths/weaknesses and external opportunities/threats, ensuring every factual claim is tied to a specific evidence ID.
- **Market Gap Discovery**: Extracts product/service gaps by comparing competitor launches or capability reports against industry snapshots.
- **Action Recommendation Engine**: Proposes specific recommendations for the host company, backed by observed competitor behavior.
- **Hallucination Protection**: Rejects outputs containing unverified or fabricated evidence IDs or invalid citations.

## Directory Structure

```text
strategic_analysis/
├── configs/
│   ├── base.yaml         # LLM hyperparameters (temp, max tokens)
│   └── thresholds.yaml   # Quality metrics and confidence score floors
├── src/
│   ├── schemas/          # Strategic response pydantic definitions
│   ├── evidence/         # Evidence aggregator pipeline
│   ├── prompts/          # Strategic-specific formatting templates
│   ├── validation/       # Post-generation grounding audits
│   ├── pipeline/         # Coordinator running the end-to-end execution
│   └── service/          # FastAPI service layer interface
├── evaluations/          # Metric evaluators for accuracy tracking
└── tests/                # Unit tests for the module's sub-components
```

## How It Works

1. **Aggregation**: The `EvidenceAggregator` gathers upstream signals, classification outcomes, sentiment metrics, and web-change logs into a unified `EvidencePack`.
2. **Scrubbing**: The `EvidenceValidator` verifies that all pack contents are structurally valid.
3. **Execution**: The `StrategicAnalysisPipeline` triggers the Gemini LLM provider. The call is wrapped in exponential backoff retries, timeouts, and a stateful circuit breaker.
4. **Validation**: The `StrategicValidator` ensures that:
   - Output perfectly conforms to the Pydantic schema.
   - Grounding rate is 100% (every claim type of `FACT` or `INFERENCE` references real input evidence IDs).
   - Generated items meet the minimum confidence score floor (e.g. 70% confidence).
5. **Observability**: Execution logs, total token use, costs, latency numbers, and audit details are tracked, while redacting any secret keys or variables.
