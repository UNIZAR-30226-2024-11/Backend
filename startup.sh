#!/bin/bash

npm install
npm run build
docker compose build
docker compose up
