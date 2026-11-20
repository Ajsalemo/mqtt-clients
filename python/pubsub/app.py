import logging
import uuid

import paho.mqtt.client as mqtt
from fastapi import FastAPI
from paho.mqtt.enums import CallbackAPIVersion
from pub.publish import publish_message
from sub.subscribe import subscribe_topic

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

TOPC = "test"


# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, reason_code, properties):
    logger.info(f"Connected with result code {reason_code}")
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    subscribe_topic(client, TOPC, logger)


# The callback for when a PUBLISH message is received from the server.
def on_message(_a, _b, msg):
    logger.info(f"Received message on topic '{msg.topic}' with payload '{msg.payload.decode()}'")


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/api/publish")
async def publish_controller():
    message_id = str(uuid.uuid4())
    logger.info(f"Publishing message with ID '{message_id}' to topic '{TOPC}'")

    publish_message(mqttc, TOPC, message_id)
    return {"status": f"Published message with ID '{message_id}' to topic '{TOPC}'"}


mqttc = mqtt.Client(CallbackAPIVersion.VERSION2)
mqttc.on_connect = on_connect
mqttc.on_message = on_message

mqttc.connect("localhost", 1883, 60)
# Start the network loop in a separate thread
# This avoids blocking everything else
mqttc.loop_start()
