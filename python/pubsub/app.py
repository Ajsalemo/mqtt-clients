import logging
import uuid
from contextlib import asynccontextmanager

import paho.mqtt.client as mqtt
from fastapi import FastAPI
from paho.mqtt.enums import CallbackAPIVersion
from pub.publish import publish_message
from sub.subscribe import subscribe_topic

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
TOPC = "test"
# Be careful to not use the same client ID as other clients. This will cause constant reconnects likel due to client id conflicts
mqttc = mqtt.Client(
    CallbackAPIVersion.VERSION2, clean_session=False, client_id="mqtt-python-pubsub"
)


# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, _userdata, _flags, reason_code, _properties):
    logger.info(f"Connected with result code {reason_code}")
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    subscribe_topic(client, TOPC, logger)


# The callback for when a PUBLISH message is received from the server.
def on_message(_a, _b, msg):
    logger.info(
        f"Received message on topic '{msg.topic}' with payload '{msg.payload.decode()}'"
    )


# See: https://fastapi.tiangolo.com/advanced/events/#async-context-manager
# The mqtt client needs to be started async. or else it blocks thread and doesn't allow FastAPI from starting properly
# important: the yield matters. everything before the yield happens on startup, everything after happens on shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    mqttc.connect("localhost", 1883, 60)
    mqttc.on_connect = on_connect
    mqttc.on_message = on_message
    mqttc.loop_start()
    yield
    mqttc.loop_stop()
    mqttc.disconnect()


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def read_root():
    return {"message": "mqtt-clients-python-pubsub"}


@app.get("/api/publish")
async def publish_controller():
    message_id = str(uuid.uuid4())
    logger.info(f"Publishing message with ID '{message_id}' to topic '{TOPC}'")

    publish_message(mqttc, TOPC, message_id)
    return {"status": f"Published message with ID '{message_id}' to topic '{TOPC}'"}
