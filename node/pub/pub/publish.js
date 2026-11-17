export const asyncPublish = async (conn, TOPIC, message) => {
    try {
        if (!conn) {
            console.error("No connection to broker");
            throw new Error("No connection to broker");
        }

        console.log(`Publishing to topic [${TOPIC}] with message: ${message}`)
        // See: https://github.com/mqttjs/MQTT.js/issues/1987
        return Promise.race([
            conn.publishAsync(TOPIC, message),
            new Promise((_, reject) => setTimeout(() => reject(new Error(`Timed out while publishing message: ${message} to topic: ${TOPIC} inside "asyncPublish()"`)), 10000))
        ])
    } catch (error) {
        console.error("Failed to publish message:", error);
    }
}