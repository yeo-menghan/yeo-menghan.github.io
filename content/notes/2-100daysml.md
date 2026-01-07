---
title: "Day 2: Updating README for Kaggle Competition: Monet"
date: "2026-01-06"
category: "100-days-ml-challenge"
---

I'm currently away on a short vacation to Hong Kong, and hence will be contributing to this challenge in small increments over the next few days. Today’s update focuses on documenting and consolidating what I learned from a recent Kaggle submission.

## Introduction
I've recently submitted an entry to the [Kaggle Competition: I’m Something of a Painter Myself](https://www.kaggle.com/competitions/gan-getting-started/overview). 

The competition serves as a practical introduction to GANs (Generative Adversarial Networks) through a style transfer task: given a dataset of real-world photos and a dataset of Claude Monet paintings, the goal is to generate images that look like Monet paintings.

A key challenge is that the datasets are unpaired - there’s no direct “this photo corresponds to this Monet painting” mapping. Because of that, typical supervised losses (like pixel-wise MSE against a target) are not a good fit, which is why approaches like CycleGAN are commonly used for this problem setting.

## Link to Projects page
You can find out more about the kaggle competition and my approach via this project link:
[Project: kaggle-monet-gan](https://yeo-menghan.com/projects/kaggle-monet-gan)