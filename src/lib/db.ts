import fs from "node:fs";
import path from "node:path";
import type { Database } from "./types";
import { seedData } from "./seed";

const isVercel = !!process.env.VERCEL;
const DB_PATH = isVercel
  ? path.join("/tmp", "db.json")
  : path.join(process.cwd(), "data", "db.json");

function ensureDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function getDb(): Database {
  ensureDir();
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(seedData, null, 2), "utf-8");
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

export function saveDb(db: Database): void {
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
