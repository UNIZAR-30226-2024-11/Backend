#!/bin/bash

if ! docker-compse down --remove-orphans
then
	docker compose down --remove-orphans
fi