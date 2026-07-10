# Executive Report Intelligence Module (Module 5)

This module implements the **Executive Report Intelligence** engine. It translates validated competitor strategic insights, metrics, and change logs into concise, professional, action-oriented executive briefs.

## Core Features

- **C-Level Communications**: Employs concise formatting, clear bulleted statements, and business outcomes.
- **Support for Multi-Report Contexts**: Configured to generate WEEKLY_BRIEFs, MONTHLY_REPORTs, COMPETITOR_PROFILEs, CHANGE_ALERTs, and EXECUTIVE_SUMMARYs.
- **Evidence Cross-Referencing**: Automatically links risk points, key developments, and suggestions back to evidence items.
- **High-Fidelity Guardrails**: Validates that all cited references correspond to input facts and checks confidence ranges.

## Directory Structure

```text
executive_report/
├── configs/
│   ├── base.yaml         # LLM parameters
│   └── thresholds.yaml   # Confidence floor and citation requirements
├── src/
│   ├── schemas/          # Executive report Pydantic definitions
│   ├── prompts/          # Report templating utilities
│   ├── validation/       # Grounding and confidence verification
│   ├── pipeline/         # Coordinator running the end-to-end report generation
│   └── service/          # API service wrapper
├── evaluations/          # Evaluators for quality checking
└── tests/                # Unit tests for the reporting engine
```

## How It Works

1. **Prompting Context**: The `ExecutiveReportPromptBuilder` wraps the competitor name, report date, validated Strategic Analysis JSON, and underlying Evidence Pack.
2. **Execution**: The `ExecutiveReportPipeline` triggers the LLM using the designated provider, with circuit breakers, timeouts, and retries.
3. **Grounding Audit**: The `ExecutiveReportValidator` scans all claims, checking that their cited source IDs exist in the input evidence pack, verifying confidence scores, and populating `evidence_references`.
