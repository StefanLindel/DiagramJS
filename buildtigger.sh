#!/usr/bin/env bash
	curl https://api.particle.io/v1/devices/events -d "name=buildState" -d "data={ \"job\": \"StefanLindel/DiagramJS\", \"type\":\"$1\"}" -d "access_token=c0406bf3c969f6735c63a0f269303c8625f1c65e"
