# Gomoku with Learning AI - Frontend

This repository contains the **React-based frontend** for a real-time Gomoku game that includes a **genetic-algorithm powered self-learning AI**.
Players can compete locally, online against other human players, or against an evolving AI bot.

Originally a personal portfolio project, it was later expanded and used as a submission for a university Artificial Intelligence course.

## Tech Stack

**Vite + React** (TypeScript)  
**Redux Toolkit** - game state, session state
**Socket.io Client** - live multiplayer + AI communication  
**MUI + Emotion** - UI components  
**Recharts** - AI dashboard visualization

## AI Overview

Although the AI itself runs on the backend, the frontend visualizes the learning process:

- Fitness over generations
- Best / average / worst strategy scores
- Live updates via Socket.io

## Gameplay Features

**Game modes:**  
Local (hotseat)  
PvP (online)  
PvAI (online)

**Three AI levels:**  
Easy → Random  
Medium → Heuristic  
Hard → Genetic Algorithm (evolving strategies)

## AI Dashboard

The Dashboard allows real-time monitoring of:

- eneration number
- strategy populations
- fitness metrics
- win-rate trends

Charts update automatically whenever the backend emits a new generation.

## Bug Report System

A built-in bug report modal allows players to report issues directly in-game.
All bug reports are saved in MongoDB (via backend).

## Live Demo & Repositories

- [Frontend Repository](https://github.com/tamastotok/amoba)
- [Backend Repository](https://github.com/tamastotok/amoba-server)
- [Live Demo](https://amoba-68115.web.app/)
