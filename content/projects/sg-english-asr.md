---
title: "SG-English ASR"
description: "Fine-tuned Whisper and Wav2Vec2 models for Singaporean English accent recognition"
date: "2025-02-15"
tags: ["Machine Learning", "NLP", "PyTorch", "Python"]
github: "https://github.com/yeo-menghan/SG_Eng_ASR"
---

# SG-English ASR

## Overview
Fine-tuned speech recognition models specifically for Singaporean English accents using Whisper and Wav2Vec2.

## Key Achievements
- Reduced Word Error Rate (WER) from **122.81% to 21.05%**
- Improved Character Error Rate (CER) from **123.61% to 6.94%**
- Decreased inference time by **58.5%** (from 0.423s to 0.176s per sample)

## Technical Approach

### Model Architecture
Used two state-of-the-art models:
1. **Whisper Base** - OpenAI's multilingual speech recognition model
2. **Wav2Vec2** - Facebook's self-supervised speech representation model

### Fine-tuning Strategy
- Applied **LoRA** (Low-Rank Adaptation) for efficient fine-tuning
- Used **Optuna** for hyperparameter optimization
- Trained on Singaporean English dataset with diverse accents

### Dataset
- Preprocessed audio files in FLAC format
- Focused on conversational and technical vocabulary
- Included domain-specific terms common in Singapore

## Results Analysis

The fine-tuned model showed significant improvement in handling:
- Singaporean accent variations
- Code-switching between English and local languages
- Domain-specific terminology

## Future Work
- Expand dataset to include more diverse accents
- Implement real-time transcription
- Optimize for mobile deployment

[GitHub Repository](https://github.com/yeo-menghan/SG_Eng_ASR)