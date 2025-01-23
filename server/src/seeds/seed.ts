import db from "../config/connection.js";
import models from "../models/index.js";
import cleanDB from "./cleanDb.js";

const { User, Report } = models;

import userData from "./userData.json" assert { type: "json" };
import reportData from "./reportData.json" assert { type: "json" };

db.once("open", async () => {
  await cleanDB("User", "users");
  await cleanDB("Report", "reports");

  await User.insertMany(userData);
  console.log("Users seeded!");

  await Report.insertMany(reportData);
  console.log("Reports seeded!");

  process.exit(0);
});
