import { carbonCredits, type CarbonCredit, type InsertCarbonCredit } from "@shared/schema";

export interface IStorage {
  listCredits(): Promise<CarbonCredit[]>;
  getCredit(id: number): Promise<CarbonCredit | undefined>;
  createCredit(credit: InsertCarbonCredit): Promise<CarbonCredit>;
  updateCredit(id: number, credit: Partial<InsertCarbonCredit>): Promise<CarbonCredit | undefined>;
  deleteCredit(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private credits: Map<number, CarbonCredit>;
  private currentId: number;

  constructor() {
    this.credits = new Map();
    this.currentId = 1;
  }

  async listCredits(): Promise<CarbonCredit[]> {
    return Array.from(this.credits.values());
  }

  async getCredit(id: number): Promise<CarbonCredit | undefined> {
    return this.credits.get(id);
  }

  async createCredit(credit: InsertCarbonCredit): Promise<CarbonCredit> {
    const id = this.currentId++;
    const newCredit: CarbonCredit = {
      ...credit,
      id,
      createdAt: new Date()
    };
    this.credits.set(id, newCredit);
    return newCredit;
  }

  async updateCredit(id: number, credit: Partial<InsertCarbonCredit>): Promise<CarbonCredit | undefined> {
    const existing = this.credits.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...credit };
    this.credits.set(id, updated);
    return updated;
  }

  async deleteCredit(id: number): Promise<boolean> {
    return this.credits.delete(id);
  }
}

export const storage = new MemStorage();