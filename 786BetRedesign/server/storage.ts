import { 
  users, games, withdrawals, deposits, chatMessages, gameSettings,
  type User, type InsertUser, type Game, type InsertGame, 
  type Withdrawal, type InsertWithdrawal, type Deposit, type InsertDeposit,
  type ChatMessage, type InsertChatMessage, type GameSettings
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Game methods
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, updates: Partial<Game>): Promise<Game | undefined>;
  getUserGames(userId: number): Promise<Game[]>;
  
  // Financial methods
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  updateWithdrawal(id: number, updates: Partial<Withdrawal>): Promise<Withdrawal | undefined>;
  getUserWithdrawals(userId: number): Promise<Withdrawal[]>;
  getPendingWithdrawals(): Promise<Withdrawal[]>;
  createDeposit(deposit: InsertDeposit): Promise<Deposit>;
  
  // Chat methods
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getRecentChatMessages(limit?: number): Promise<ChatMessage[]>;
  
  // Settings methods
  getGameSettings(): Promise<GameSettings | undefined>;
  updateGameSettings(updates: Partial<GameSettings>): Promise<GameSettings | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private games: Map<number, Game> = new Map();
  private withdrawals: Map<number, Withdrawal> = new Map();
  private deposits: Map<number, Deposit> = new Map();
  private chatMessages: Map<number, ChatMessage> = new Map();
  private gameSettings: GameSettings | undefined;
  
  private currentUserId = 1;
  private currentGameId = 1;
  private currentWithdrawalId = 1;
  private currentDepositId = 1;
  private currentChatId = 1;

  constructor() {
    // Initialize with some demo data
    this.initializeData();
  }

  private initializeData() {
    // Create demo admin user
    this.createUser({
      username: "admin",
      email: "admin@786bet.casino",
      password: "admin123",
    });

    // Create demo regular user
    this.createUser({
      username: "player1",
      email: "player1@example.com", 
      password: "password123",
    });

    // Initialize game settings
    this.gameSettings = {
      id: 1,
      aviatorRtp: "97.00",
      maxMultiplier: 1000,
      minBet: "1.00",
      maxBet: "1000.00",
      referrerBonus: "10.00",
      refereeBonus: "20.00",
      minDepositForBonus: "50.00",
      referralActive: true,
      updatedAt: new Date(),
    };
  }

  private generateReferralCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      balance: "100.00", // Starting balance
      totalWinnings: "0.00",
      gamesPlayed: 0,
      referralCode: this.generateReferralCode(),
      totalReferrals: 0,
      activeReferrals: 0,
      referralEarnings: "0.00",
      referredBy: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Game methods
  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.currentGameId++;
    const game: Game = {
      ...insertGame,
      id,
      multiplier: null,
      payout: "0.00",
      status: "active",
      createdAt: new Date(),
      autoCashOut: insertGame.autoCashOut ?? null,

    };
    this.games.set(id, game);
    return game;
  }

  async updateGame(id: number, updates: Partial<Game>): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;
    
    const updatedGame = { ...game, ...updates };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async getUserGames(userId: number): Promise<Game[]> {
    return Array.from(this.games.values())
      .filter(game => game.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Financial methods
  async createWithdrawal(insertWithdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const id = this.currentWithdrawalId++;
    const withdrawal: Withdrawal = {
      ...insertWithdrawal,
      id,
      status: "pending",
      createdAt: new Date(),
      processedAt: null,
    };
    this.withdrawals.set(id, withdrawal);
    return withdrawal;
  }

  async updateWithdrawal(id: number, updates: Partial<Withdrawal>): Promise<Withdrawal | undefined> {
    const withdrawal = this.withdrawals.get(id);
    if (!withdrawal) return undefined;
    
    const updatedWithdrawal = { ...withdrawal, ...updates };
    if (updates.status && updates.status !== "pending") {
      updatedWithdrawal.processedAt = new Date();
    }
    this.withdrawals.set(id, updatedWithdrawal);
    return updatedWithdrawal;
  }

  async getUserWithdrawals(userId: number): Promise<Withdrawal[]> {
    return Array.from(this.withdrawals.values())
      .filter(w => w.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getPendingWithdrawals(): Promise<Withdrawal[]> {
    return Array.from(this.withdrawals.values())
      .filter(w => w.status === "pending")
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async createDeposit(insertDeposit: InsertDeposit): Promise<Deposit> {
    const id = this.currentDepositId++;
    const deposit: Deposit = {
      ...insertDeposit,
      id,
      status: "completed",
      createdAt: new Date(),
    };
    this.deposits.set(id, deposit);
    return deposit;
  }

  // Chat methods
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatId++;
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getRecentChatMessages(limit = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit)
      .reverse();
  }

  // Settings methods
  async getGameSettings(): Promise<GameSettings | undefined> {
    return this.gameSettings;
  }

  async updateGameSettings(updates: Partial<GameSettings>): Promise<GameSettings | undefined> {
    if (!this.gameSettings) return undefined;
    
    this.gameSettings = { ...this.gameSettings, ...updates, updatedAt: new Date() };
    return this.gameSettings;
  }
}

export const storage = new MemStorage();
