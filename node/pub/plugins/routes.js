import { publishController } from "../controllers/publishController.js";

export const routes = (fastify) => {
  fastify.get("/api/publish", publishController);
};