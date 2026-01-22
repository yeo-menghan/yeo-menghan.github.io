---
title: "IPPT Situp & Pushup Trainer"
description: "ELISS-Like Push-Up & Sit-Up Counter"
date: "2026-01-01"
tags: ["Computer Vision", "Pose Estimation", "Python", "JavaScript"]
github: "https://github.com/yeo-menghan/ippt-trainer"
---

## Problem

After ORD, I've became kinda fatter and not able to get gold for IPPT anymore. While my body did get fatter, so did my brain (i hope so), and with the power of computer vision I want to gain back what I've lost - the ability to max out push-ups and sit-ups at the 2 IPPT stations. 

## Solution

I built a lightweight, real-time computer vision application using MediaPipe for pose estimation and OpenCV for video processing. The system:

- Tracks key body joints to compute joint angles (e.g., elbow for push-ups, hip for sit-ups)
- Uses angle thresholds and motion direction to count reps intelligently
- Provides live visual feedback via a skeleton overlay and on-screen cues
- Supports switching between push-up and sit-up modes with simple keypresses (P/S)
- Runs entirely on a standard laptop with a webcam - no cloud or wearable required

To be fair, this solution is vibe-coded as my IPPT is coming up and and I needed a way to actually train properly.

## Outcome

The detector can count repetitions in real time with reasonable accuracy under good lighting and framing. While most other push-up / sit-up detectors detect from the front (camera facing your face), I've implemented it the way ELISS did it (from the side) in order to ensure that we provide as similar an experience under the ELISS machine (outside of the haptics) in order to train well to get that $500!

## Challenges

- Pose Occlusion: Side-view requirements mean users must stay perfectly aligned; turning slightly breaks tracking.
- Angle Threshold Tuning: Rep counting logic is sensitive to threshold values - what works for one person may miscount for another due to height, flexibility, or stance.
- The side-view placement may also require more positioning as opposed to the front-view before the user can begin proper training

With only 2 weeks, I did pass with incentive, scoring only $200. Will train harder next year round to get that Gold!