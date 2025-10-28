🎮 Project: Gomoku with Learning AI
🧠 Overview

This project is a full-stack, real-time Gomoku (Five in a Row) game featuring multiple play modes and a self-learning AI opponent.
Players can compete locally, online versus other players, or against an AI that adapts its strategy through generations using a genetic algorithm.
The system demonstrates real-time multiplayer communication, AI-driven gameplay, and data visualization in a unified architecture.

⚙️ Tech Stack

Frontend: React (TypeScript), Redux, MUI (Emotion), Socket.io, Recharts
Backend: Node.js, Express, MongoDB, Socket.io
Architecture: Full MERN stack with WebSocket communication and persistent AI state.

🤖 AI Component

The AI module includes three difficulty levels:

Easy: Random-based decision-making.

Medium: Heuristic-based evaluation of board positions.

Hard: A Genetic Algorithm that evolves strategies by simulating populations, crossover, and mutation.
Each generation’s fitness scores, win rates, and performance metrics are stored in a MongoDB database and visualized in real time on an AI Dashboard built with Recharts.

🌐 Features

Real-time online multiplayer powered by Socket.io

AI learning process visualization via AI Dashboard

Admin authentication for accessing training statistics

Smooth animations and modern UI using MUI + Framer Motion

Redux-based global state management for gameplay and session control

Scroll-lock and overlay control for enhanced UX

Responsive design optimized for desktop and mobile devices

📊 AI Dashboard

The AI Dashboard provides real-time monitoring of the learning process.
Each generation is plotted dynamically, showing average, best, and worst fitness values, as well as win rate trends over time.
Updates are pushed live from the backend using WebSocket events, allowing users to visualize how the AI evolves and improves.

🏁 Outcome

This project was originally developed as a university assignment for Artificial Intelligence, later extended into a portfolio-level full-stack application.
It showcases strong practical understanding of real-time systems, AI integration, and full-stack architecture, making it both a technical achievement and a visually engaging interactive experience.

🚀 Live Demo / Repository

(You can add links here once deployed)

Frontend: [your-frontend-link-here]

Backend: [your-backend-link-here]

GitHub: [repo-link-here]
