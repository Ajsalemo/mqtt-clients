import { v7 as uuidv7 } from "uuid";

export const asyncPublish = async (conn, TOPIC) => {
    try {
        if (!conn) {
            console.error("No connection to broker");
            throw new Error("No connection to broker");
        }
        
        const uuid = uuidv7();
        console.log(`Publishing to topic [${TOPIC}] with message: ${uuid}`)
        // See: https://github.com/mqttjs/MQTT.js/issues/1987
        return Promise.race([
            conn.publishAsync(TOPIC, uuid),
            new Promise((_, reject) => setTimeout(() => reject(new Error(`Timed out while publishing message to topic: ${TOPIC} inside "asyncPublish()"`)), 10000))
        ])
    } catch (error) {
        console.error("Failed to publish message:", error);
    }
}