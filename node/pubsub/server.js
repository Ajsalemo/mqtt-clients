import Fastify from 'fastify';
import { connectAsync } from "mqtt";
import { routes } from './plugins/routes.js';
import { subMessages } from './sub/messages.js';
import { subscribeAsync } from './sub/subscribe.js';

const fastify = Fastify({
    logger: true
})
const MOSQUITTO_BROKER_URL = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
const PORT = process.env.PORT || 3000;
export const TOPIC = process.env.TOPIC || "test";
// Register all controller routes
fastify.register(routes)

const connectBroker = async () => {
    try {
        console.log(`Connecting to mosquitto broker at ${MOSQUITTO_BROKER_URL}`);
        const client = await connectAsync(MOSQUITTO_BROKER_URL);
        client.on("error", (error) => {
            console.error("Connection error:", error);
            client.end();
        });
        // After connecting, subscribe to topics
        await subscribeAsync(client, TOPIC);

        return client;
    } catch (error) {
        console.error("Failed to connect to mosquitto broker", error);
    }
}

export const conn = await connectBroker();

const start = async () => {
    try {
        const address = await fastify.listen({ port: PORT });
        console.log(`Fastify listening at ${address}`);

        // Singleton connection to the mosquitto broker
        // Check at startup if connection to the broker is successful
        if (!conn) {
            console.error("No connection to broker");
            process.exit(1)
        }
            // Listen for incoming messages on the subscribed topic
        await subMessages(conn);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start(); 