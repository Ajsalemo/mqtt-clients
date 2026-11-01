export const subscribeAsync = async (client, TOPIC) => {
    try {
        if (!client) {
            console.error("No connection to broker");
            return;
        }
        console.log(`Subscribing to topic [${TOPIC}]`);
        const subscribe = await client.subscribeAsync(TOPIC);
        // Iterate over topics being subscribed to
        // in this case, its just one (1)
        subscribe.forEach((topic) => {
            console.log(`Subscribed to topic [${topic.topic}]`);
        });
    } catch (error) {
        console.error("Failed to subscribe to topic:", error);
    }
}