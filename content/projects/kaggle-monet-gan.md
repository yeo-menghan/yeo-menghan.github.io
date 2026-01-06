---
title: "Kaggle: Monet GAN"
description: "Kaggle Competition: I’m Something of a Painter Myself"
date: "2026-01-02"
tags: ["GAN", "Python", "Tensorflow", "Keras", "Kaggle"]
link: "https://www.kaggle.com/code/yeomenghan/notebookc00857604d"
---

## Context: *I’m Something of a Painter Myself*
This Kaggle competition is a **style transfer** problem: you’re given a set of real-world photos and a set of Claude Monet paintings, and the goal is to generate images that look like Monet paintings.

A key detail is that the datasets are **unpaired**: there is no “same scene” photo ↔ Monet ground-truth pair. That makes common supervised losses (like pixel-wise MSE against a target image) a bad fit, and it’s why **CycleGAN** became a standard approach.

These are some of the original monet images:
![directory](/monet/monet_images.png)

---

## What are GANs?
A **Generative Adversarial Network (GAN)** trains two neural networks in opposition:

- **Generator** $G$: creates fake samples (images).
- **Discriminator** $D$: predicts whether an image is **real** (from the dataset) or **fake** (from $G$).

### Generator, discriminator, and the core objective
In the original GAN formulation, the discriminator tries to maximize the probability of classifying real and fake images correctly, while the generator tries to fool it:

$$
\min_G \max_D V(D, G) =
\mathbb{E}_{x \sim p_{\text{data}}}[\log D(x)] +
\mathbb{E}_{z \sim p_z}[\log (1 - D(G(z)))]
$$

In practice, many implementations use the “non-saturating” generator loss because it gives stronger gradients early in training:

$$
\min_G \; - \mathbb{E}_{z \sim p_z}[\log D(G(z))]
$$

### What are GANs usually used for?
GANs have been used for:

- **Image synthesis** (creating new images from a learned distribution)
- **Image-to-image translation** (e.g., photo $\leftrightarrow$ painting)
- **Super-resolution** and **inpainting**
- **Domain adaptation** (aligning distributions across domains)

For this competition, the relevant category is **unpaired image-to-image translation**.

---

## GANs used in this project: DCGAN and CycleGAN

### Why these two?
They represent two different ways to approach the problem:

- **DCGAN** learns *what Monet paintings look like* (unconditional generation), but it does not inherently preserve the content of a specific input photo.
- **CycleGAN** learns a mapping *from photos to Monet style* while enforcing content preservation through cycle consistency.

---

## DCGAN
**DCGAN (Deep Convolutional GAN)** is a classic convolutional GAN where:

- $G$ upsamples from a latent vector $z$ to an image.
- $D$ downsamples an image to output a real/fake score.

Output from DCGAN:
![directory](/monet/DCGAN.png)

### Why did DCGAN give blurry images?
In this competition setting, blurriness (or “soft”, low-detail outputs) is common for a few reasons:

1. **No conditioning on the input photo**  
   DCGAN isn’t built to translate *this* photo into Monet style. It’s built to generate “a Monet-like image”. Without an explicit constraint to preserve structure, it may produce plausible colors/textures but weak scene geometry.

2. **Training instability**  
   GAN training is a minimax game. If $D$ becomes too strong (or training becomes imbalanced), gradients can become unhelpful for $G$, and outputs often get stuck in low-detail regimes.

3. **Architecture and resolution limitations**  
   If capacity is limited or the receptive field isn’t effective for capturing both global composition and fine brush-stroke texture, the generator learns low-frequency color statistics first, and sharp details may never emerge.

---

## CycleGAN
**CycleGAN** is designed for **unpaired translation**.

It learns two mappings:

- $G: X \rightarrow Y$ (Photo $\rightarrow$ Monet)
- $F: Y \rightarrow X$ (Monet $\rightarrow$ Photo)

And uses two discriminators:

- $D_Y$ distinguishes real Monet images from $G(x)$
- $D_X$ distinguishes real photos from $F(y)$

### Cycle consistency (the key improvement)
Since we don’t have paired examples, CycleGAN introduces the idea that translating there-and-back should recover the original:

$$
F(G(x)) \approx x
\quad\text{and}\quad
G(F(y)) \approx y
$$

This is typically implemented as an L1 cycle-consistency loss:

$$
\mathcal{L}_{\text{cycle}}(G,F) =
\mathbb{E}_{x \sim p_X}[\|F(G(x)) - x\|_1] +
\mathbb{E}_{y \sim p_Y}[\|G(F(y)) - y\|_1]
$$

Some implementations also add an **identity loss** to reduce unnecessary color shifts:

$$
\mathcal{L}_{\text{id}}(G,F) =
\mathbb{E}_{y \sim p_Y}[\|G(y) - y\|_1] +
\mathbb{E}_{x \sim p_X}[\|F(x) - x\|_1]
$$

Output from CycleGAN:
![directory](/monet/CycleGAN.png)

- Real Photo: $x$ (input, real)
- Photo → Monet: $G(x)$ (generated translation you care about)
- Reconstructed Photo: $F(G(x))$ (generated for training/validation of content preservation)

### Why is CycleGAN much better than DCGAN here?
CycleGAN is better for this competition because it enforces both:

- **Style realism** via adversarial losses (outputs look like Monet paintings)
- **Content preservation** via cycle consistency (the scene stays recognizable)

So instead of producing generic Monet-like images, it produces Monet-styled versions of *your* photos.

---

## Why are GANs not as relevant in industry anymore?
GANs still show up in some production systems, but they are no longer the default choice for many image generation problems. A few reasons:

1. **Diffusion models dominate modern image generation**  
   Diffusion models are generally more stable to train, scale well, and produce high-quality results across many tasks (generation, editing, inpainting).

2. **Stability and reproducibility**  
   GANs can be sensitive to hyperparameters and training balance, with failure modes like mode collapse. Many industry teams prefer methods that are easier to train and debug.

3. **Better control and conditioning elsewhere**  
   Modern workflows often require controllable generation (text prompts, editing constraints, guidance). Diffusion + guidance techniques provide strong control knobs.

4. **Ecosystem momentum**  
   Tooling, pretrained models, and research attention have largely shifted toward diffusion and transformer-based approaches.

GANs still matter historically (and conceptually), and adversarial losses are still used in some pipelines, but for “state-of-the-art generative imaging” the center of gravity has moved.

---

## Closing thoughts
This competition is a great example of matching the model to the data:

- With **unpaired domains**, **CycleGAN** is a natural fit because it learns a mapping and enforces content preservation.
- **DCGAN** can learn “Monet-ness”, but it is not designed to translate a specific photo, which often shows up as blurry or incoherent outputs in this task.