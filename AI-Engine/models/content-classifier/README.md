# Content Classifier

This model classifies competitor intelligence text into one of eight labels:

- PRICING
- FEATURE
- PRODUCT_LAUNCH
- PARTNERSHIP
- INTEGRATION
- SECURITY
- HIRING
- GENERAL_NEWS

## Goal

Input: raw text such as a blog post, release note, or announcement.

Output: a label and confidence score.

## Recommended training setup

- Base model: distilbert-base-uncased
- Split: 80/10/10
- Primary metric: Macro F1
- Target: Macro F1 >= 0.80

## Data strategy

The dataset should be composed of:

- 50–60% real/public + curated examples
- 25–35% synthetic examples
- 10–15% hard/boundary examples

This codebase contains the full preprocessing and inference scaffolding required for that workflow.
