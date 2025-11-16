---
title: "LoRA: Low-Rank Adaptation of Large Language Models"
date: "2025-11-08"
category: "Research Papers"
paper: "Hu et al. (2021)"
---

# LoRA: Low-Rank Adaptation

**Authors**: Hu et al. (2021)

## Problem Statement

Fine-tuning large language models is computationally expensive and requires storing multiple copies of billion-parameter models for different tasks.

## Solution: Low-Rank Adaptation

LoRA freezes pre-trained model weights and injects trainable rank decomposition matrices into each layer.

### Mathematical Formulation

For a pre-trained weight matrix $W_0 \in \mathbb{R}^{d \times k}$, LoRA represents the weight update as:

$$W = W_0 + \Delta W = W_0 + BA$$

Where:
- $B \in \mathbb{R}^{d \times r}$ and $A \in \mathbb{R}^{r \times k}$
- $r \ll \min(d, k)$ is the rank
- Only $A$ and $B$ are trained, $W_0$ is frozen

The forward pass becomes:

$$h = W_0x + BAx$$

## Key Advantages

### 1. Parameter Efficiency

The number of trainable parameters is:

$$\text{trainable params} = r \times (d + k)$$

Compared to full fine-tuning:

$$\text{full params} = d \times k$$

For typical values ($r=8$, $d=k=4096$), this is a **>99% reduction**.

### 2. No Additional Inference Latency

At inference, we can merge the weights:

$$W' = W_0 + BA$$

So there's no computational overhead.

### 3. Task Switching

Multiple LoRA modules can be stored and swapped efficiently.

## Practical Insights

From my experience using LoRA:

1. **Rank selection**: $r=4$ to $r=16$ works well for most tasks
2. **Alpha parameter**: Usually set to $2r$
3. **Target modules**: Apply to query and value projections in attention layers
4. **Learning rate**: Can be higher than full fine-tuning (1e-4 to 5e-4)

## Use Cases

- Task-specific adaptation (my SG-English ASR project)
- Domain adaptation
- Instruction tuning
- Personalization

## Limitations

- May underperform full fine-tuning on very different tasks
- Requires careful hyperparameter tuning
- Not suitable for catastrophic forgetting scenarios

This technique has been crucial in democratizing LLM fine-tuning.