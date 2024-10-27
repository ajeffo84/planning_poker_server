# Planning Poker Server

Backend server for the Planning Poker application, handling real-time game state and player interactions.

## Features

- Real-time game state management with Socket.IO
- Support for multiple concurrent players
- Automatic admin assignment
- Vote submission and revelation
- Round management
- Player session handling

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=3001
   CLIENT_URL=http://localhost:5173
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Socket Events

#### Client -> Server

- `join`: Join the game with player details
  ```typescript
  { playerId: string, name: string }
  ```

- `vote`: Submit a vote
  ```typescript
  { playerId: string, vote: number }
  ```

- `reveal-cards`: Reveal all cards (admin only)

- `start-new-round`: Start a new round (admin only)

- `toggle-vote-change`: Toggle whether votes can be changed after reveal (admin only)

#### Server -> Client

- `game-state`: Updated game state
  ```typescript
  {
    players: Record<string, Player>;
    revealed: boolean;
    roundStartTime: number;
    allowVoteChange: boolean;
  }
  ```

## Deployment

1. Set up your production environment variables
2. Build and deploy to your preferred hosting service
3. Update the client's Socket.IO connection URL to match your deployed server

## Security Considerations

- CORS is configured to accept connections only from the specified client URL
- Admin privileges are managed server-side
- Player sessions are tracked using unique IDs