def publish_message(client, topic, message_id):
    client.publish(topic, message_id, qos=1, retain=False, properties={"message_id": message_id})