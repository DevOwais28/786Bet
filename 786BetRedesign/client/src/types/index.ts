export interface User {
  id: number;
  username: string;
  email: string;
  balance: string;
  totalWinnings: string;
  gamesPlayed: number;
  referralCode: string;
  totalReferrals: number;
  activeReferrals: number;
  referralEarnings: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  referredBy?: string | null;
}

export interface GameSettings {
  aviatorRtp: string;
  maxMultiplier: number;
  minBet: string;
  maxBet: string;
  referrerBonus: string;
  refereeBonus: string;
  minDepositForBonus: string;
  referralActive: boolean;
}

export interface Game {
  id: number;
  userId: number;
  gameType: string;
  betAmount: string;
  multiplier: string | null;
  payout: string;
  autoCashOut: string | null;
  status: string;
  createdAt: Date;
}

export interface Withdrawal {
  id: number;
  userId: number;
  amount: string;
  method: string;
  status: string;
  createdAt: Date;
  processedAt?: Date | null;
}

export interface Deposit {
  id: number;
  userId: number;
  amount: string;
  method: string;
  status: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: number;
  userId: number;
  username?: string;
  message: string;
  createdAt: Date;
}

export interface GameRound {
  id: string;
  multiplier: number;
  crashPoint: number;
  startTime: number;
  status: 'waiting' | 'starting' | 'running' | 'crashed';
  players: Player[];
}

export interface Player {
  id: string;
  username: string;
  betAmount: number;
  cashoutMultiplier: number | null;
  profit: number;
  status: 'betting' | 'playing' | 'cashed_out' | 'lost';
}

export interface Bet {
  id: string;
  amount: number;
  multiplier: number;
  status: 'pending' | 'won' | 'lost';
  profit: number;
  roundId: string;
  timestamp: string;
}
