export const subMessages = async (conn) => {
    try {
        if (!conn) {
            console.error("No connection to broker");
            throw new Error("No connection to broker");
        }
        conn.on("message", async (topic, message) => {
            console.log(`Received message on topic [${topic}]: ${message.toString()}`);
        });
    } catch (error) {
        console.error("Failed to handle incoming messages:", error);
    }
}