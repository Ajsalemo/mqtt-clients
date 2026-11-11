export const asyncPublish = async (conn, TOPIC) => {
    try {
        if (!conn) {
            console.error("No connection to broker");
            throw new Error("No connection to broker");
        }
        console.log(`Publishing to topic [${TOPIC}] with message: 'Hello MQTT'`)
        await conn.publishAsync(TOPIC, "Hello MQTT");
    } catch (error) {
        console.error("Failed to publish message:", error);
    }
}