# Infobytes
Infobytes is a project aimed at exploring the potential of Large Language Models (LLMs) to generate engaging common knowledge facts. The core idea is to utilize these facts to captivate a user base, encouraging them to learn and share intriguing pieces of information. To complement this concept, we've developed a feed similar to TikTok's style, where generated facts are transformed into short videos. On top of that questions about already seen facts will appear as you progress in the feed to encourage learning. This is also gamified bu introducing player levels.

## Modules
Infobytes comprises three main modules:

1. Frontend Module
The frontend module is a React Native application built upon Ignite's Boilerplate. It serves as the user interface where users can browse through the feed, watch fact videos, answer fact questions, and interact with the platform.

2. Backend Module
The backend module is powered by NestJS and utilizes Prisma as the ORM (Object-Relational Mapping) tool. PostgreSQL is employed as the database to store user data, generated facts, and other relevant information. 

3. Fact Video Generator
The fact video generator is a crucial component responsible for transforming generated facts into visually appealing short videos. It leverages technologies such as canvas-node for frame rendering, FFMPEG for video processing, stable diffusion image generation for backgrounds, and Text-to-Speech (TTS) for narrating the facts.

## Video Demo
Sadly, these video demos are not from the latest version.