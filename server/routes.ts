import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertCarbonCreditSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/credits", async (_req, res) => {
    const credits = await storage.listCredits();
    res.json(credits);
  });

  app.post("/api/credits", async (req, res) => {
    const parsed = insertCarbonCreditSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const credit = await storage.createCredit(parsed.data);
    res.json(credit);
  });

  app.patch("/api/credits/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const credit = await storage.updateCredit(id, req.body);
    if (!credit) {
      return res.status(404).json({ error: "Credit not found" });
    }
    res.json(credit);
  });

  app.delete("/api/credits/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteCredit(id);
    if (!success) {
      return res.status(404).json({ error: "Credit not found" });
    }
    res.json({ success: true });
  });

  return createServer(app);
}