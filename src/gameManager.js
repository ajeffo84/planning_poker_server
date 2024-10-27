export class GameManager {
  constructor() {
    this.players = new Map();
    this.revealed = false;
    this.roundStartTime = Date.now();
    this.allowVoteChange = true;
    this.socketToPlayerId = new Map();
  }

  addPlayer(playerId, name, isAdmin = false) {
    this.players.set(playerId, {
      id: playerId,
      name,
      vote: null,
      isAdmin
    });
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
    
    // If the admin left and there are other players, make the first one admin
    if (this.getPlayerCount() > 0) {
      const hasAdmin = Array.from(this.players.values()).some(p => p.isAdmin);
      if (!hasAdmin) {
        const firstPlayer = Array.from(this.players.values())[0];
        firstPlayer.isAdmin = true;
      }
    }
  }

  submitVote(playerId, vote) {
    const player = this.players.get(playerId);
    if (player && (this.allowVoteChange || !this.revealed)) {
      player.vote = vote;
    }
  }

  revealCards() {
    this.revealed = true;
  }

  startNewRound() {
    this.revealed = false;
    this.roundStartTime = Date.now();
    for (const player of this.players.values()) {
      player.vote = null;
    }
  }

  toggleVoteChange() {
    this.allowVoteChange = !this.allowVoteChange;
  }

  getGameState() {
    return {
      players: Object.fromEntries(this.players),
      revealed: this.revealed,
      roundStartTime: this.roundStartTime,
      allowVoteChange: this.allowVoteChange
    };
  }

  getPlayerCount() {
    return this.players.size;
  }

  isAdmin(socketId) {
    const playerId = this.socketToPlayerId.get(socketId);
    const player = this.players.get(playerId);
    return player?.isAdmin;
  }

  getPlayerIdBySocketId(socketId) {
    return this.socketToPlayerId.get(socketId);
  }
}