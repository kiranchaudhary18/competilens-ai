# CompetiLens AI Engine

This directory contains the machine-learning engineering scaffolding for the CompetiLens pipeline.

## Recommended rollout

1. Content Classifier (first, required for downstream routing)
2. Sentiment Intelligence Model (second, for review/customer-opinion analysis)

## Structure

- models/content-classifier: first production-ready classifier for competitor intelligence text
- models/sentiment-intelligence: second stage sentiment model scaffold
- src/common: shared utilities and config helpers
- src/inference: prediction entry points
- src/api: service-oriented interfaces for backend integration

## Data strategy

The initial dataset design follows the recommended mix:

- 50–60% Real/Public + Curated Data
- 25–35% Synthetic Data
- 10–15% Hard/Boundary Examples

Training is intentionally not executed in this scaffold. The code is designed for future fine-tuning with Hugging Face Transformers and PyTorch.
