import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { GameManager } from './gameManager.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
});

app.use(cors());

const gameManager = new GameManager();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join', ({ playerId, name }) => {
    const isFirstPlayer = gameManager.getPlayerCount() === 0;
    gameManager.addPlayer(playerId, name, isFirstPlayer);
    gameManager.socketToPlayerId.set(socket.id, playerId);
    socket.join('game-room');
    
    // Broadcast updated game state to all clients
    io.to('game-room').emit('game-state', gameManager.getGameState());
  });

  socket.on('vote', ({ playerId, vote }) => {
    gameManager.submitVote(playerId, vote);
    io.to('game-room').emit('game-state', gameManager.getGameState());
  });

  socket.on('reveal-cards', () => {
    if (gameManager.isAdmin(socket.id)) {
      gameManager.revealCards();
      io.to('game-room').emit('game-state', gameManager.getGameState());
    }
  });

  socket.on('start-new-round', () => {
    if (gameManager.isAdmin(socket.id)) {
      gameManager.startNewRound();
      io.to('game-room').emit('game-state', gameManager.getGameState());
    }
  });

  socket.on('toggle-vote-change', () => {
    if (gameManager.isAdmin(socket.id)) {
      gameManager.toggleVoteChange();
      io.to('game-room').emit('game-state', gameManager.getGameState());
    }
  });

  socket.on('disconnect', () => {
    const playerId = gameManager.getPlayerIdBySocketId(socket.id);
    if (playerId) {
      gameManager.removePlayer(playerId);
      gameManager.socketToPlayerId.delete(socket.id);
      io.to('game-room').emit('game-state', gameManager.getGameState());
    }
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});