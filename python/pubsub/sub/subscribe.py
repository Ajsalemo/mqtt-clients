def subscribe_topic(client, topic, logger):
    logger.info(f"Subscribing to topic '{topic}'")
    client.subscribe(topic)
    logger.info(f"Subscribed to topic '{topic}'")