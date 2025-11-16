---
title: "Attention Is All You Need - Transformer Architecture"
date: "2025-11-12"
category: "Research Papers"
paper:
  title: "Attention Is All You Need"
  authors: "Vaswani et al."
  year: 2017
  url: "https://arxiv.org/abs/1706.03762"
---

# Attention Is All You Need

**Authors**: Vaswani et al. (2017)

## Core Idea

The Transformer architecture revolutionized sequence-to-sequence modeling by relying entirely on attention mechanisms, dispensing with recurrence and convolutions.

## Key Components

### Self-Attention Mechanism

The scaled dot-product attention is computed as:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

Where:
- $Q$ (queries), $K$ (keys), and $V$ (values) are linear projections of the input
- $d_k$ is the dimension of the keys
- The scaling factor $\frac{1}{\sqrt{d_k}}$ prevents the dot products from growing too large

### Multi-Head Attention

Instead of performing a single attention function, multi-head attention projects the queries, keys, and values $h$ times with different learned projections:

$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, ..., \text{head}_h)W^O$$

Where each head is:

$$\text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$$

### Position Embeddings

Since the model has no recurrence, positional information is injected using:

$$PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d}}\right)$$

$$PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d}}\right)$$

## Architecture Benefits

1. **Parallelization**: Unlike RNNs, all positions can be processed simultaneously
2. **Long-range dependencies**: Direct connections between all positions
3. **Interpretability**: Attention weights show what the model focuses on

## Impact

This architecture became the foundation for:
- BERT (2018)
- GPT series (2018-present)
- T5 (2019)
- And virtually all modern LLMs

## Key Takeaways

- Attention mechanisms can replace recurrence entirely
- Multi-head attention provides different representation subspaces
- Position encodings are crucial for maintaining sequence order
- The architecture scales exceptionally well