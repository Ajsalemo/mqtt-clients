import { connectAsync } from "mqtt";

const MOSQUITTO_BROKER_URL = "mqtt://localhost:1883";

const subscribeAsync = async(client) => {
    try {
        if (!client) {
            console.error("No connection to broker");
            return;
        }
        console.log("Subscribing to topic [test]");
        const subscribe = await client.subscribeAsync("test");
        // Iterate over topics being subscribed to
        // in this case, its just one (1)
        subscribe.forEach((topic) => {
            console.log(`Subscribed to topic [${topic.topic}]`);
        });
    } catch (error) {
        console.error("Failed to subscribe to topic:", error);
    }
}

const connectBroker = async () => {
    try {
        console.log(`Connecting to mosquitto broker at ${MOSQUITTO_BROKER_URL}`);
        const client = await connectAsync(MOSQUITTO_BROKER_URL);
        client.on("error", (error) => {
            console.error("Connection error:", error);
            client.end();
        });
        // After connecting, subscribe to topics
        await subscribeAsync(client);

        return client;
    } catch (error) {
        console.error("Failed to connect to mosquitto broker", error);
    }   
}

// Singleton connection to the mosquitto broker
const conn = await connectBroker();

const asyncPublish = async() => {
    try {
        if (!conn) {
            console.error("No connection to broker");
            return;
        }
        console.log("Publishing to topic [test] with message: 'Hello MQTT'")
        await conn.publishAsync("test", "Hello MQTT");
    } catch (error) {
        console.error("Failed to publish message:", error);
    }
}

const subMessages = async () => {
    try {
        if (!conn) {
            console.error("No connection to broker");
            return;
        }
        conn.on("message", async (topic, message) => {
            console.log(`Received message on topic [${topic}]: ${message.toString()}`);
        });
    } catch (error) {
        console.error("Failed to handle incoming messages:", error);
    }
}

await asyncPublish();
await subMessages();