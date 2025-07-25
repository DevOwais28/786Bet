import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertUserSchema, insertGameSchema, insertWithdrawalSchema, insertDepositSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil" as const,
});

// Session user interface
declare global {
  namespace Express {
    interface Request {
      session: {
        userId?: number;
        destroy: (callback: (err: any) => void) => void;
      };
    }
  }
}

// Auth schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = insertUserSchema.extend({
  email: z.string().email(),
  password: z.string().min(6),
  referralCode: z.string().optional(),
});

// Game schemas
const betSchema = z.object({
  amount: z.number().min(1),
  autoCashOut: z.number().min(1.01).optional(),
});

const cashOutSchema = z.object({
  betId: z.number(),
});

// Admin schemas
const approveWithdrawalSchema = z.object({
  withdrawalId: z.string(),
});

// Helper function to require authentication
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Helper function to require admin
const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const user = await storage.getUser(req.session.userId);
  if (!user || user.email !== "admin@786bet.casino") {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      
      // Create user
      const user = await storage.createUser({
        username: validatedData.email.split('@')[0], // Use email prefix as username
        email: validatedData.email,
        password: validatedData.password, // In production, hash this
        referredBy: validatedData.referralCode,
      });
      
      // Handle referral bonus if applicable
      if (validatedData.referralCode) {
        const referrer = await storage.getUserByEmail("admin@786bet.casino"); // Find by referral code logic
        if (referrer) {
          await storage.updateUser(referrer.id, {
            totalReferrals: (referrer.totalReferrals || 0) + 1,
            activeReferrals: (referrer.activeReferrals || 0) + 1,
          });
        }
      }
      
      res.status(201).json({ message: "Registration successful", userId: user.id });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user || user.password !== validatedData.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      req.session.userId = user.id;
      res.json({ message: "Login successful", userId: user.id });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // User routes
  app.get("/api/user/profile", requireAuth, async (req, res, next) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive data
      const { password, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/user/history", requireAuth, async (req, res, next) => {
    try {
      const games = await storage.getUserGames(req.session.userId!);
      
      // Format game history with time ago
      const formattedGames = games.map(game => ({
        ...game,
        timeAgo: getTimeAgo(game.createdAt || new Date()),
      }));
      
      res.json(formattedGames);
    } catch (error) {
      next(error);
    }
  });

  // Game routes
  app.post("/api/game/bet", requireAuth, async (req, res, next) => {
    try {
      const validatedData = betSchema.parse(req.body);
      const userId = req.session.userId!;
      
      // Check user balance
      const user = await storage.getUser(userId);
      if (!user || parseFloat(user.balance || "0") < validatedData.amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      
      // Create game bet
      const game = await storage.createGame({
        userId,
        gameType: "aviator",
        betAmount: validatedData.amount.toString(),
        autoCashOut: validatedData.autoCashOut?.toString(),
      });
      
      // Deduct bet amount from user balance
      const newBalance = (parseFloat(user.balance || "0") - validatedData.amount).toFixed(2);
      await storage.updateUser(userId, { 
        balance: newBalance,
        gamesPlayed: (user.gamesPlayed || 0) + 1 
      });
      
      res.json({ 
        id: game.id, 
        amount: validatedData.amount,
        autoCashOut: validatedData.autoCashOut,
        currentMultiplier: 1.0 
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/game/cashout", requireAuth, async (req, res, next) => {
    try {
      const validatedData = cashOutSchema.parse(req.body);
      const userId = req.session.userId!;
      
      const game = await storage.updateGame(validatedData.betId, {
        status: "cashed_out",
        multiplier: "2.45", // This would be the current multiplier from game state
        payout: "61.25", // Calculate based on bet amount * multiplier
      });
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      // Add winnings to user balance
      const user = await storage.getUser(userId);
      if (user) {
        const newBalance = (parseFloat(user.balance || "0") + parseFloat(game.payout || "0")).toFixed(2);
        const newTotalWinnings = (parseFloat(user.totalWinnings || "0") + parseFloat(game.payout || "0")).toFixed(2);
        await storage.updateUser(userId, { 
          balance: newBalance,
          totalWinnings: newTotalWinnings 
        });
      }
      
      res.json({ message: "Cash out successful", payout: game.payout });
    } catch (error) {
      next(error);
    }
  });

  // Chat routes
  app.get("/api/chat/messages", async (req, res, next) => {
    try {
      const messages = await storage.getRecentChatMessages(50);
      const users = await storage.getAllUsers();
      const userMap = new Map(users.map(u => [u.id, u]));
      
      const formattedMessages = messages.map(msg => {
        const user = userMap.get(msg.userId);
        return {
          id: msg.id.toString(),
          username: user?.username || "Unknown",
          message: msg.message,
          timestamp: (msg.createdAt || new Date()).toISOString(),
          avatar: user?.username.charAt(0).toUpperCase() || "?",
        };
      });
      
      res.json(formattedMessages);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/chat/send", requireAuth, async (req, res, next) => {
    try {
      const { message } = req.body;
      if (!message || message.trim().length === 0) {
        return res.status(400).json({ message: "Message cannot be empty" });
      }
      
      if (message.length > 200) {
        return res.status(400).json({ message: "Message too long" });
      }
      
      const chatMessage = await storage.createChatMessage({
        userId: req.session.userId!,
        message: message.trim(),
      });
      
      res.json({ id: chatMessage.id, message: "Message sent" });
    } catch (error) {
      next(error);
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", requireAuth, async (req, res, next) => {
    try {
      const { amount } = req.body;
      
      if (!amount || amount < 10) {
        return res.status(400).json({ message: "Minimum deposit amount is $10" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          userId: req.session.userId!.toString(),
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Financial routes
  app.post("/api/user/deposit", requireAuth, async (req, res, next) => {
    try {
      const validatedData = insertDepositSchema.parse({
        userId: req.session.userId!,
        amount: req.body.amount,
        method: req.body.method,
      });
      
      const deposit = await storage.createDeposit(validatedData);
      
      // Add deposit amount to user balance
      const user = await storage.getUser(req.session.userId!);
      if (user) {
        const newBalance = (parseFloat(user.balance || "0") + parseFloat(validatedData.amount || "0")).toFixed(2);
        await storage.updateUser(req.session.userId!, { balance: newBalance });
      }
      
      res.json({ message: "Deposit successful", depositId: deposit.id });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/user/withdraw", requireAuth, async (req, res, next) => {
    try {
      const validatedData = insertWithdrawalSchema.parse({
        userId: req.session.userId!,
        amount: req.body.amount,
        method: req.body.method,
      });
      
      // Check user balance
      const user = await storage.getUser(req.session.userId!);
      if (!user || parseFloat(user.balance || "0") < parseFloat(validatedData.amount || "0")) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      
      const withdrawal = await storage.createWithdrawal(validatedData);
      
      // Deduct withdrawal amount from user balance
      const newBalance = (parseFloat(user.balance || "0") - parseFloat(validatedData.amount || "0")).toFixed(2);
      await storage.updateUser(req.session.userId!, { balance: newBalance });
      
      res.json({ message: "Withdrawal request submitted", withdrawalId: withdrawal.id });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/user/withdrawals", requireAuth, async (req, res, next) => {
    try {
      const withdrawals = await storage.getUserWithdrawals(req.session.userId!);
      const formattedWithdrawals = withdrawals.map(w => ({
        ...w,
        timeAgo: getTimeAgo(w.createdAt || new Date()),
      }));
      res.json(formattedWithdrawals);
    } catch (error) {
      next(error);
    }
  });

  // Admin routes
  app.get("/api/admin/users", requireAdmin, async (req, res, next) => {
    try {
      const users = await storage.getAllUsers();
      const sanitizedUsers = users.map(({ password, ...user }) => user);
      res.json(sanitizedUsers);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/withdrawals/pending", requireAdmin, async (req, res, next) => {
    try {
      const withdrawals = await storage.getPendingWithdrawals();
      const users = await storage.getAllUsers();
      const userMap = new Map(users.map(u => [u.id, u]));
      
      const formattedWithdrawals = withdrawals.map(w => ({
        ...w,
        user: userMap.get(w.userId),
        timeAgo: getTimeAgo(w.createdAt || new Date()),
      }));
      
      res.json(formattedWithdrawals);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/withdrawals/:id/approve", requireAdmin, async (req, res, next) => {
    try {
      const withdrawalId = parseInt(req.params.id);
      const withdrawal = await storage.updateWithdrawal(withdrawalId, { status: "approved" });
      
      if (!withdrawal) {
        return res.status(404).json({ message: "Withdrawal not found" });
      }
      
      res.json({ message: "Withdrawal approved successfully" });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/withdrawals/:id/reject", requireAdmin, async (req, res, next) => {
    try {
      const withdrawalId = parseInt(req.params.id);
      const withdrawal = await storage.updateWithdrawal(withdrawalId, { status: "rejected" });
      
      if (!withdrawal) {
        return res.status(404).json({ message: "Withdrawal not found" });
      }
      
      // Refund the withdrawal amount to user balance
      const user = await storage.getUser(withdrawal.userId);
      if (user) {
        const newBalance = (parseFloat(user.balance || "0") + parseFloat(withdrawal.amount || "0")).toFixed(2);
        await storage.updateUser(withdrawal.userId, { balance: newBalance });
      }
      
      res.json({ message: "Withdrawal rejected and amount refunded" });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/users/:id/ban", requireAdmin, async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.updateUser(userId, { status: "banned" });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "User banned successfully" });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/settings/game", requireAdmin, async (req, res, next) => {
    try {
      const settings = await storage.getGameSettings();
      res.json(settings);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/admin/settings/game", requireAdmin, async (req, res, next) => {
    try {
      const settings = await storage.updateGameSettings(req.body);
      res.json({ message: "Settings updated successfully", settings });
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else {
    return `${diffDays} days ago`;
  }
}
