import models from "../models/index.js";
import db from "../config/connection.js";

//cleans out the models/collections of the database before seeding the mock data
export default async (modelName: "User" | "Report" | "OTSReport", collectionName: string) => {
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
