import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
  totalWinnings: decimal("total_winnings", { precision: 10, scale: 2 }).default("0.00"),
  gamesPlayed: integer("games_played").default(0),
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"),
  totalReferrals: integer("total_referrals").default(0),
  activeReferrals: integer("active_referrals").default(0),
  referralEarnings: decimal("referral_earnings", { precision: 10, scale: 2 }).default("0.00"),
  status: text("status").default("active"), // active, inactive, banned
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  gameType: text("game_type").notNull(), // aviator
  betAmount: decimal("bet_amount", { precision: 10, scale: 2 }).notNull(),
  multiplier: decimal("multiplier", { precision: 5, scale: 2 }),
  payout: decimal("payout", { precision: 10, scale: 2 }).default("0.00"),
  autoCashOut: decimal("auto_cash_out", { precision: 5, scale: 2 }),
  status: text("status").notNull(), // active, cashed_out, crashed
  createdAt: timestamp("created_at").defaultNow(),
});

export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: text("method").notNull(), // bank, paypal, crypto
  status: text("status").default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const deposits = pgTable("deposits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: text("method").notNull(), // credit_card, bank_transfer, crypto
  status: text("status").default("completed"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameSettings = pgTable("game_settings", {
  id: serial("id").primaryKey(),
  aviatorRtp: decimal("aviator_rtp", { precision: 4, scale: 2 }).default("97.00"),
  maxMultiplier: integer("max_multiplier").default(1000),
  minBet: decimal("min_bet", { precision: 10, scale: 2 }).default("1.00"),
  maxBet: decimal("max_bet", { precision: 10, scale: 2 }).default("1000.00"),
  referrerBonus: decimal("referrer_bonus", { precision: 4, scale: 2 }).default("10.00"),
  refereeBonus: decimal("referee_bonus", { precision: 10, scale: 2 }).default("20.00"),
  minDepositForBonus: decimal("min_deposit_for_bonus", { precision: 10, scale: 2 }).default("50.00"),
  referralActive: boolean("referral_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  referredBy: true,
});

export const insertGameSchema = createInsertSchema(games).pick({
  userId: true,
  gameType: true,
  betAmount: true,
  autoCashOut: true,
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).pick({
  userId: true,
  amount: true,
  method: true,
}).extend({
  accountDetails: z.string().min(1, "Account details are required"),
});

export const insertDepositSchema = createInsertSchema(deposits).pick({
  userId: true,
  amount: true,
  method: true,
}).extend({
  stripePaymentIntentId: z.string().optional(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  message: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertDeposit = z.infer<typeof insertDepositSchema>;
export type Deposit = typeof deposits.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type GameSettings = typeof gameSettings.$inferSelect;
