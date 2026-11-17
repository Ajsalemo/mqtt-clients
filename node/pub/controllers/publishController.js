import { v7 as uuidv7 } from "uuid";
import { asyncPublish } from "../pub/publish.js";
import { conn, TOPIC } from "../server.js";

export const publishController = async (_req, res) => {
  try {
    const uuid = uuidv7();

    await asyncPublish(conn, TOPIC, uuid);
    res.code(200).header("Content-Type", "application/json; charset=utf-8").send({ msg: `Message: ${uuid} published successfully to topic: ${TOPIC}` });
  } catch (error) {
    res.code(500).header("Content-Type", "application/json; charset=utf-8").send({ error: error.message });
  }
};