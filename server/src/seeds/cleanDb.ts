import models from "../models/index.js";
import db from "../config/connection.js";

export default async (modelName: "User" | "Report", collectionName: string) => {
  try {
    if (models[modelName].db.db) {
      let modelExists = await models[modelName].db.db
        .listCollections({
          name: collectionName,
        })
        .toArray();

      if (modelExists.length) {
        await db.dropCollection(collectionName);
      }
    }
  } catch (err) {
    throw err;
  }
};
