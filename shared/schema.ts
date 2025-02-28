import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const carbonCredits = pgTable("carbon_credits", {
  id: serial("id").primaryKey(),
  tokenId: text("token_id").notNull(),
  owner: text("owner").notNull(),
  amount: integer("amount").notNull(),
  price: integer("price"),
  listed: boolean("listed").default(false),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertCarbonCreditSchema = createInsertSchema(carbonCredits).omit({
  id: true,
  createdAt: true
});

export type InsertCarbonCredit = z.infer<typeof insertCarbonCreditSchema>;
export type CarbonCredit = typeof carbonCredits.$inferSelect;
