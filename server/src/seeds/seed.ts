import db from "../config/connection.js";
import models from "../models/index.js";
import cleanDB from "./cleanDb.js";

const { User, Report } = models;

async function loadJson(filePath: string) {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

db.once("open", async () => {
  await cleanDB("User", "users");
  await cleanDB("Report", "reports");

  const userData = await loadJson(
    new URL("./userData.json", import.meta.url).pathname
  );
  await User.insertMany(userData);
  console.log("Users seeded!");

  const reportData = await loadJson(
    new URL("./reportData.json", import.meta.url).pathname
  );
  await Report.insertMany(reportData);
  console.log("Reports seeded!");

  process.exit(0);
});
