#!/bin/bash

if ! docker-compose down --remove-orphans --volumes
then
	docker compose down --remove-orphans --volumes
fi