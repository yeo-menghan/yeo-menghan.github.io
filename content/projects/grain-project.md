---
title: "Grain Project: Driver-Event Allocation using LLM"
description: "Take-home assignment for Grain AI Engineer Role"
date: "2025-10-28"
tags: ["LLM", "Python"]
github: "https://github.com/yeo-menghan/grain-project"
---

Spent 5 days creating this agent-inspired LLM-based driver-event allocator where rules for the allocation is set within the context of the LLM prompt. The json output is evaluated deterministically and thereafter the evaluation and json output is given back to the LLM for the next round of allocation --> Error reduces after each round.

Some issues faced:
- LLM allocation is not deterministic, hence error may fluctuate without any proper reason why that's the case.
- Model cost: while the more intelligent model (i.e. GPT-4.1) is able to provide better allocations, it is much much more costly than a cheaper model (GPT-4.1-mini). The improvement to error rate is marginal too and can fluctuate; some runs with the less intelligent model outperformed the more intelligent model.

Please refer to the github readme for a deeper dive of this project!