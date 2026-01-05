---
title: "Day 1: ML Project Deployment using Github Actions & AWS Beanstalk"
date: "2026-01-05"
category: "100-days-ml-challenge"
---

## Introduction
One thing I am lacking is deployment knowledge, which came up again and again during my last semesters' job interviews. I will fix that today.

I will be combining 2 tutorials to utilise both Github Actions and AWS Beanstalk. The original tutorial on using github actions pushes the code to huggingface instead of AWS but I believe there will be more value in learning AWS, especially in debugging configurations compared to the more hassle free deployment of gradio apps to hugging face.

## Project Code

For the full breakdown, please refer to the Projects page: [End-to-end ML Deployment](http://yeo-menghan.com/projects/e2e-ml-deployment).

All full code snippets will be documented within the projects page.

## Resources

AWS Beanstalk: 
- [Tutorial 9-End To End ML Project-Deployment In AWS Cloud Using CICD Pipelines
](https://www.youtube.com/watch?v=gbJn2Ls2QsI)
- [Day 81: Deploying an ML Project to AWS Cloud Using CI/CD](https://medium.com/@bhatadithya54764118/day-81-deploying-an-ml-project-to-aws-cloud-using-ci-cd-87653f25c1d7)

CI/CD using github actions:
- [Datacamp: A Beginner's Guide to CI/CD for Machine Learning](https://www.datacamp.com/tutorial/ci-cd-for-machine-learning)

## Progress

![directory](/1-100daysml/directory.png)

I've utilised the datacamp tutorial to set up the file structure and experimented in recreating the ci.yml pipeline. Given the tutorial was 2 years old, there were some removed features for model loading from skops that requires refactoring. 

The `ci.yml` is pretty cool because it actually sends a report of the model's metrics to the user's email:

![email-report](/1-100daysml/email-report.png)

The harder part was creating the cd.yml and AWS configurations. Using GPT-5.2-instant, I've troubleshooted and created a working cd.yml pipeline which triggers after the completion of `ci.yml`. I've also added `.elasticbeanstalk` `config.yml`, `.config` files and `.ebextensions`. The gradio app also needs some configuration to suit the beanstalk environment.

![ci.yml](/1-100daysml/ci.png)

![cd.yml](/1-100daysml/cd.png)

The hardest part was porting over my previous `AWS configurations` (from my school account) to my personal account for future usage. This requires the creation of access keys with adminRoles and re-configuring the aws credentials and config on my laptop.

These are some helpful commands to establish your aws account locally
```bash
aws sts get-caller-identity
unset AWS_PROFILE 
nano ~/.aws/config   
nano ~/.aws/credentials
aws configure # should ensure that the config is default
```

## Results
However, I'm met with an <mark>unexpected 502 Bad Gateway</mark> after successfully deploying the beanstalk environment. Troubleshooting will continue for Day 2 of the challenge but I believe it may have to do with Nginx and gradio.

![gateaway.yml](/1-100daysml/bad-gateway.png)

Additional TODOs:
- There's an issue with storing the data directly on github - how can we make sure the data is kept private?
