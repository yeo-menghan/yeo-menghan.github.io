---
title: "Grain Project: Driver-Event Allocation using LLM"
description: "Take-home assignment for Grain AI Engineer Role"
date: "2025-10-28"
tags: ["LLM", "Python", "Folium"]
github: "https://github.com/yeo-menghan/grain-project"
---
## Problem
Allocating driver–event pairs in a logistics or scheduling context is a complex combinatorial optimization task. Traditional rule-based or heuristic approaches may lack flexibility or adaptability to dynamic constraints. To address this, I've designed a multi-turn LLM-based agent system that encodes allocation rules directly into the prompt context to iteratively get better allocation results.

## Solutions Tried

- Developed an iterative, agent-inspired pipeline where the LLM generates a JSON-formatted allocation based on contextual rules.
- Implemented a deterministic evaluator that computes an error metric from the JSON output.
- Fed both the allocation and its evaluation back into the LLM as part of a feedback loop, enabling refinement over successive rounds.
- Experimented with two model variants: a high-capability (e.g., GPT-4.1) and a cost-efficient (e.g., GPT-4.1-mini) version to assess performance–cost trade-offs.

## Outcome
- The iterative feedback loop generally reduced allocation error over rounds, demonstrating the potential of LLMs as flexible optimizers when guided by structured evaluation.
- However, improvements were inconsistent: error sometimes fluctuated unpredictably due to the non-deterministic nature of LLM outputs.
- Surprisingly, the cheaper model occasionally outperformed the more capable one—suggesting diminishing returns on model intelligence for this specific task.

## Challenges
- Non-determinism: Identical prompts could yield different allocations across runs, making error trajectories unstable and hard to interpret.
- Cost vs. Performance Trade-off: The more intelligent model incurred significantly higher inference costs for only marginal (and sometimes negative) gains in accuracy.
- Evaluation Sensitivity: Small changes in LLM output formatting or phrasing could disproportionately affect the deterministic evaluator, introducing noise into the feedback signal.


Please refer to the [github readme](https://github.com/yeo-menghan/grain-project) for a deeper dive of this project!