#!/bin/bash

if !command -v docker-compose &>/dev/null; then
    echo "docker-compose no está instalado o no está en la PATH"
    echo "Es necesario para arrancar las imágenes de Docker"
    exit 1
fi

if !command -v npm &>/dev/null; then
    echo "npm no está instalado o no está en la PATH"
    echo "Es necesario para construir el proyecto"
    exit 1
fi

if ! npm install; then
    echo "Error al instalar las dependencias de Node.js"
    exit 1
fi

if ! npm run build; then
    echo "Error al construir el proyecto"
    exit 1
fi

if ! docker-compose build; then
    if ! docker compose build; then
        echo "Error al construir las imágenes de Docker"
        exit 1
    fi
fi

if [[ $1 == "dev" ]]; then
    if ! docker-compose up -d db
    then
        docker compose up -d db
    fi
    npm run dev
else
    if ! docker-compose up
    then
        docker compose up
    fi
fi
