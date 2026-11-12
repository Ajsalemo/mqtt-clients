#!/bin/bash

docker run -d --name mosquitto -p 1883:1883 -v "$PWD/mosquitto/config:/mosquitto/config" -v "$PWD/mosquitto/data:/mosquitto/data" eclipse-mosquitto:2.1.2-alpine
