import { asyncPublish } from "../pub/publish.js";
import { conn, TOPIC } from "../server.js";

export const publishController = async (req, res) => {
  try {
    await asyncPublish(conn, TOPIC);
    res.code(200).header("Content-Type", "application/json; charset=utf-8").send({ msg: `Message published successfully to topic: ${TOPIC}` });
  } catch (error) {
    res.code(500).header("Content-Type", "application/json; charset=utf-8").send({ error: error.message });
  }
};