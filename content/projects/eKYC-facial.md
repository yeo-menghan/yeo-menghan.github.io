---
title: "eKYC facial identify verification"
description: "Exploring AWS deployment and facial detection model training"
date: "2026-01-10"
tags: ["Computer Vision", "AWS", "Github Actions", "Docker", "ONNX", "FastAPI"]
github: "https://github.com/yeo-menghan/eKYC-facial"
---

When I set out to build an **eKYC facial liveness verification pipeline**, I knew it wasn’t just about slapping a model on a server. Real-world identity verification systems must balance security, usability, and robustness- especially when deployed in regulated environments like fintech or government services. Here’s how I approached the problem, what worked, what didn’t, and where I’d go next.

## The Problem: Trusting a Face in the Digital Age
In today’s remote-first world, verifying someone’s identity via a selfie is table stakes—but it’s also trivial to spoof with a printed photo, phone screen replay, or even a high-res deepfake. A naive “face detection + match” system fails catastrophically against these attacks. Worse, poor lighting, motion blur, or a user standing too far from the camera can cause false rejections, frustrating real users.

So the challenge was threefold:

1. Reject low-quality inputs early (no point wasting compute on unusable images).
2. Reliably distinguish live faces from spoofs—even under adversarial conditions.
3. Serve this as a scalable, observable API on AWS without breaking the bank.

## The Solution

I architected the system as a sequential gatekeeper:

```
[Client Upload] 
    → [Image Quality Gate] 
    → [Face Liveness Model] 
    → [FastAPI Endpoint] 
    → [AWS EC2 + CloudWatch]
```

### 1. Image Quality Gate: Fail Fast, Save Resources
Before any ML inference, the system runs lightweight checks:

- Brightness: Rejects images outside a calibrated range (e.g., pitch-dark or overexposed).
- Blur: Uses Laplacian variance—simple but effective for detecting motion blur or focus issues.
- Face Size: Ensures the detected face occupies enough pixels (via MediaPipe BlazeFace) to be meaningful.

If someone uploads a blurry passport photo, we tell them why it failed (“Image too dark”) instead of silently returning a false spoof verdict. Nevertheless, this portion still needs to be tuned as this is a proof of concept.

### 2. Liveness Model: MobileNet Over YOLO
I evaluated several architectures but landed on MobileNetV3-Small for good reason:
- Task alignment: Liveness is a global texture/noise classification problem—not object detection. YOLO’s box regression head adds unnecessary overhead.
- Deployment efficiency: ONNX-compiled MobileNet runs smoothly on a t3.small EC2 instance (2 vCPUs, 2GB RAM)—well within AWS Free Tier limits.
- Latency: Sub-200ms inference on CPU, including preprocessing.

The model was trained on a subset of the CelebA-Spoof Mini dataset (~20k balanced samples) using transfer learning, Adam optimizer, and BCEWithLogitsLoss. Augmentations like random flips and color jitter helped generalization - but couldn’t fully overcome dataset bias.

> ⚠️ Reality Check: Despite decent overall metrics, the model showed lower accuracy on Asian faces during manual testing—a known limitation of CelebA’s Western-centric bias. This is a hard reminder: your model is only as fair as your data.

### 3. Production API: FastAPI + ONNX Runtime
The backend is a lean FastAPI service that:
- Accepts multipart/form-data image uploads.
- Runs quality checks (optional via ?enable_checks=false).
- Preprocesses images identically to training (224×224, ImageNet normalization).
- Runs inference via ONNX Runtime (no PyTorch dependency at runtime!).
- Returns structured JSON with is_live, confidence, and failure reasons.

Why ONNX? It gave us framework-agnostic, low-latency inference and simplified Docker images. No more “works on my machine” surprises.

## Outcome & Trade-Offs

On the test set:
- BPCER (false rejections): 2.8% — acceptable for UX.
- APCER (false accepts): 24.4% — too high for production security.

This imbalance reveals the core tension in liveness systems: usability vs. security. The model is biased toward calling things “live” to avoid blocking real users—but that leaves the door open for spoofers.

We could shift the decision threshold (e.g., require 90% confidence to declare “live”), but that would increase BPCER. A proper DET curve analysis is needed to find the right operating point for a given use case (e.g., banking vs. social media signup).

## Deployment: GitHub Actions + AWS ECR + EC2
The entire pipeline is CI/CD-driven:
- Push to main → GitHub Actions builds Docker images.
- Models are pulled from private S3 (not Git!) at build time.
- Images tagged with Git SHA → pushed to ECR.
- EC2 instance pulls and restarts services via docker-compose.

This gives us:
- Full traceability: Every deployment maps to a commit.
- Safe rollbacks: Redeploy an old SHA if needed.
- Separation of concerns: Training pipeline updates models in S3; serving pipeline stays untouched.

## Challenges & Lessons Learned

1. Data bias exists in datasets. In this dataset, it's the lack of asian faces. Hence, more should be done about data collection but that will take quite some time
2. Threshold Tuning Matters: A 0.5 cutoff is naive. Real systems calibrate thresholds against APCER/BPCER targets per ISO/IEC 30107.
3. Static Images Aren’t Enough: Future work must include temporal liveness (blink detection, head movement) to defeat high-quality replays.
4. Hardware Limits: Running on CPU-only EC2 means we can’t use heavier models—yet. Model distillation or quantization could help.

## What’s Next?
- Deepfake robustness: Test against GAN-generated faces.
- Zero-downtime deploys: Blue/green or canary releases via ECS/EKS.
- Edge deployment: Export to TensorFlow Lite for mobile SDKs.
- Active liveness: Challenge-response (e.g., “turn your head left”).

The full project is live at [https://project-spoof.yeo-menghan.com](https://project-spoof.yeo-menghan.com).
Code, Docker setup, and training notebooks are on [GitHub](https://github.com/yeo-menghan/eKYC-facial).