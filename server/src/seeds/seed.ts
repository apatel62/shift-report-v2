import db from "../config/connection.js";
import models from "../models/index.js";
import cleanDB from "./cleanDb.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

// const { User, Report } = models;
const { User } = models;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonDirectory = path.resolve(__dirname, "../../src/seeds"); // or wherever the files are located after building
async function loadJson(filePath: string) {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

db.once("open", async () => {
  await cleanDB("User", "users");
  await cleanDB("Report", "reports");

  const userData = await loadJson(path.join(jsonDirectory, "userData.json"));
  await User.insertMany(userData);
  console.log("Users seeded!");

  // const reportData = await loadJson(path.join(jsonDirectory, "reportData.json"));
  // await Report.insertMany(reportData);
  // console.log("Reports seeded!");

  process.exit(0);
});
