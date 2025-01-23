import db from "../config/connection.js";
import models from "../models/index.js";
import cleanDB from "./cleanDb.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const { User, Report } = models;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadJson(filePath: string) {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

db.once("open", async () => {
  await cleanDB("User", "users");
  await cleanDB("Report", "reports");

  const userData = await loadJson(path.resolve(__dirname, "userData.json"));
  await User.insertMany(userData);
  console.log("Users seeded!");

  const reportData = await loadJson(path.resolve(__dirname, "reportData.json"));
  await Report.insertMany(reportData);
  console.log("Reports seeded!");

  process.exit(0);
});
