---
title: "AISG National AI Challenge 2024"
description: "Top 3 Winner - Email fraud detection system using LangChain and GPT-3.5"
date: "2024-05-20"
tags: ["LLM", "LangChain", "Chrome Extension"]
github: "https://github.com/aisg-2024/langchain_backend"
---

# AISG National AI Challenge 2024 - Top 3 Winner

## Project Overview
Developed an intelligent email fraud detection system that integrates directly with Gmail to identify phishing attempts and fraudulent emails.

## Architecture

### Backend (LangChain)
- Engineered **Chain-of-Thought prompts** for GPT-3.5-turbo
- Implemented sophisticated fraud detection logic
- Designed custom prompt templates for high accuracy

### Frontend (Chrome Extension)
- Integrated **Gmail API** for seamless email access
- Real-time analysis of incoming emails
- User-friendly interface for fraud alerts

## Key Features

### Fraud Detection Elements
1. Unrealistic demands and threats
2. Poor spelling and grammar
3. Suspicious URLs and links
4. Requests for confidential information
5. Vague or generic salutations
6. Improper domain names
7. Inconsistent sender details

### Technical Implementation
Used JSON Output Parser from LangChain to structure responses:
- `is_phishing` (boolean)
- `phishing_score` (0-10 scale)
- `rationale` (detailed explanation)

## Impact
The system achieved high accuracy in detecting various types of email fraud while minimizing false positives, making email communication safer for users.

[GitHub Repository](https://github.com/aisg-2024/langchain_backend)