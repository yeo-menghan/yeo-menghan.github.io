---
title: "Taxi Demand Forecasting at Changi Airport"
description: "Improved forecasting accuracy from 48% to 62% using XGBoost and deployed on AWS"
date: "2025-08-30"
tags: ["Machine Learning", "AWS", "XGBoost"]
---

# Taxi Demand Forecasting at Changi Airport

## Project Context
Developed during my internship at Changi Airport Group to optimize taxi allocation and reduce passenger wait times.

## Challenge
Accurately predict taxi passenger demand across different terminals and time periods to improve operational efficiency.

## Solution

### Model Development
- Implemented **XGBoost** regression model
- Engineered features from historical data:
  - Flight schedules and turnaround times
  - Seasonal patterns
  - Day of week and time of day
  - Weather conditions
  - Special events

### Performance Improvement
Increased forecasting accuracy from **48% to 62%** through:
- Feature engineering and selection
- Hyperparameter tuning
- Ensemble methods

### Deployment
- Built **CI/CD pipeline** for automated deployment
- Utilized AWS services:
  - **CloudFormation** for infrastructure as code
  - **ECR** for container registry
  - **Lambda** for serverless inference
- Implemented monitoring and alerting

## Data Pipeline
- Conducted EDA on **18,000+ flight turnarounds**
- Identified operational bottlenecks
- Built automated data pipeline on **Amazon SageMaker**

## Business Impact
The improved forecasting enables better resource allocation, reducing passenger wait times and improving overall airport experience.