#!/bin/bash

if !command -v docker &>/dev/null; then
    echo "docker no está instalado o no está en la PATH"
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

#Modificación para crear las tablas en la base de datos
if ! node pg.js; then
    echo "Error al ejecutar el script de creación de tablas"
    exit 1
fi

if ! docker compose build; then
    echo "Error al construir las imágenes de Docker"
    exit 1
fi

if [[ $1 == "dev" ]]; then
    docker compose up -d db
    npm run dev
else
    docker compose up
fi
